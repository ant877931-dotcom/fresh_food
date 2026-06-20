import { supabase } from '../config/supabase.js';

export const historyRepository = {
  async getHistoryData(filters = {}) {
    let query = supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total_amount,
        status,
        payment_type,
        user_id,
        profiles ( full_name ),
        order_items (
          quantity,
          price_at_time,
          foods ( 
            name,
            categories ( name ) 
          )
        ),
        invoices (
          id,
          midtrans_transaction_id,
          qr_code_url,
          scanned_at
        )
      `)
      .order('created_at', { ascending: false });

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte('created_at', end.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching history:', error);
      throw error;
    }

    let result = data;

    // Post-filtering for deep nested attributes if needed
    if (filters.category || filters.foodName) {
      result = result.filter(order => {
        if (!order.order_items) return false;

        return order.order_items.some(item => {
          const f = item.foods;
          if (!f) return false;

          let foodMatch = true;
          if (filters.foodName && !f.name.toLowerCase().includes(filters.foodName.toLowerCase())) {
            foodMatch = false;
          }

          return foodMatch;
        });
      });
    }

    if (filters.sortBy === 'highest') {
      result.sort((a, b) => (b.total_amount ?? 0) - (a.total_amount ?? 0));
    } else if (filters.sortBy === 'lowest') {
      result.sort((a, b) => (a.total_amount ?? 0) - (b.total_amount ?? 0));
    }
    // Default order is already handled by .order('created_at', { ascending: false }) above

    return result;
  },

  async completeOrderByInvoice(scannedData) {
    if (!scannedData) throw new Error("Data QR kosong.");

    const rawData = scannedData.trim();
    let invoice = null;

    // TEKNIK 1: Pencarian Berdasarkan URL Penuh
    // Jika data scan terlihat seperti URL, coba cocokkan langsung dengan kolom qr_code_url
    if (rawData.includes('http') || rawData.includes('supabase.co')) {
        const { data } = await supabase
            .from('invoices')
            .select('*, orders(*)')
            .eq('qr_code_url', rawData)
            .single();
        if (data) invoice = data;
    }

    // TEKNIK 2: Ekstraksi UUID menggunakan Regex
    // Jika Teknik 1 gagal, kita "sedot" paksa format UUID dari string hasil scan
    if (!invoice) {
        const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const match = rawData.match(uuidRegex);

        if (match) {
            const extractedUuid = match[0];
            
            // Coba cari UUID tersebut di kolom order_id
            const { data: byOrderId } = await supabase
                .from('invoices')
                .select('*, orders(*)')
                .eq('order_id', extractedUuid)
                .single();
            
            if (byOrderId) {
                invoice = byOrderId;
            } else {
                // Jika tidak ada, coba cari UUID tersebut di kolom id (Invoice ID)
                const { data: byInvoiceId } = await supabase
                    .from('invoices')
                    .select('*, orders(*)')
                    .eq('id', extractedUuid)
                    .single();
                invoice = byInvoiceId;
            }
        }
    }

    // Jika setelah semua teknik data tetap tidak ditemukan
    if (!invoice) {
        console.error("Data scan mentah:", rawData);
        throw new Error("Data pesanan tidak ditemukan di sistem kami.");
    }

    // --- VALIDASI DOUBLE SCAN ---
    // Cegah proses jika pesanan sudah pernah dikonfirmasi sebelumnya
    if (invoice.orders && invoice.orders.status === 'confirmed') {
        throw new Error("DITOLAK: Pesanan ini sudah diselesaikan dan diambil sebelumnya!");
    }
    // ----------------------------

    // --- PROSES UPDATE ---
    
    // 1. Catat waktu scan di tabel invoices
    const { error: updateInvoiceError } = await supabase
        .from('invoices')
        .update({ scanned_at: new Date().toISOString() })
        .eq('id', invoice.id);

    if (updateInvoiceError) throw new Error("Gagal mencatat waktu scan invoice.");

    // 2. Pastikan status pesanan diubah menjadi 'confirmed' setelah berhasil di-scan
    const numericOrderId = invoice.orders.id;
    const { data, error: updateOrderError } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', numericOrderId)
        .eq('status', 'paid'); // HANYA update jika statusnya 'paid'

    if (updateOrderError) throw new Error("Gagal mengupdate status pesanan menjadi confirmed.");

    // --- LOGIKA PENGURANGAN STOK (MANUAL JS) YANG SANGAT KETAT ---
    
    // 1. KUNCI TARGET: Dapatkan ID pesanan secara mutlak dari invoice ini
    const targetOrderId = invoice.orders.id;

    // 2. AMBIL ITEM: Pastikan kita HANYA mengambil makanan dari pesanan INI SAJA!
    const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('food_id, quantity')
        .eq('order_id', targetOrderId); // <--- FILTER KRUSIAL! Tidak boleh hilang.

    if (itemsError) {
        throw new Error("Gagal mengambil detail item dari pesanan ini.");
    }

    // 3. EKSEKUSI: Kurangi stok berdasarkan item yang ditemukan
    if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
            
            // a. Ambil stok riil saat ini dari tabel foods
            const { data: foodData, error: foodError } = await supabase
                .from('foods')
                .select('stock')
                .eq('id', item.food_id)
                .single();

            if (foodData && !foodError) {
                // b. Kalkulasi mutlak: Stok saat ini - jumlah yang dibeli DI PESANAN INI SAJA
                const sisaStok = foodData.stock - item.quantity;

                // c. Simpan kembali
                await supabase
                    .from('foods')
                    .update({ stock: sisaStok })
                    .eq('id', item.food_id);
            }
        }
    }
    // --- AKHIR LOGIKA PENGURANGAN STOK ---

    return invoice; // Fungsi selesai, kembalikan data
  }
};
