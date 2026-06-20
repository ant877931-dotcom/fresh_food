// src/infrastructure/repositories/adminRepository.js
import { supabase } from '../config/supabase.js';

export const adminRepository = {
  /**
   * Upload gambar makanan ke storage
   */
  async uploadFoodImage(file) {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('food-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('food-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Tambah data makanan
   */
  async addFood(foodData) {
    const { data, error } = await supabase
      .from('foods')
      .insert([foodData])
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Update data makanan
   */
  async updateFood(id, foodData) {
    const { data, error } = await supabase
      .from('foods')
      .update(foodData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Hapus makanan
   */
  async deleteFood(id) {
    const { error } = await supabase
      .from('foods')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Mengambil data pesanan berdasarkan rentang tanggal
   */
  async getOrdersByDateRange(startDate, endDate) {
    let query = supabase
      .from('orders')
      .select('*, order_items(*, foods(name, price))')
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      // Ensure it covers the whole end date
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte('created_at', end.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Verifikasi invoice berdasarkan QR string dan perbarui order jadi delivered
   */
  async verifyInvoiceAndCompleteOrder(invoiceCode) {
    // Cari invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('order_id')
      .eq('invoice_code', invoiceCode)
      .single();

    if (invoiceError || !invoice) {
      throw new Error("Invoice tidak valid atau tidak ditemukan.");
    }

    // Ubah status order menjadi delivered
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({ status: 'delivered' })
      .eq('id', invoice.order_id)
      .select()
      .single();

    if (orderError) {
      throw new Error("Gagal mengupdate status pesanan.");
    }

    return order;
  },

  /**
   * Mengambil data analitik berdasarkan timeframe
   * @param {string} timeframe - 'Hari Ini', 'Bulan Ini', 'Tahun Ini'
   */
  async getAnalyticsData(timeframe) {
    let query = supabase
      .from('orders')
      .select('*, order_items(*, foods(name, price, id))')
      .order('created_at', { ascending: true });

    const now = new Date();
    let startDate;

    if (timeframe === 'Hari Ini') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (timeframe === 'Bulan Ini') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeframe === 'Tahun Ini') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Mengambil semua kategori
   */
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Menambahkan kategori
   */
  async addCategory(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Update kategori
   */
  async updateCategory(id, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Hapus kategori
   */
  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
