// src/presentation/customer/customerHistoryController.js
import { customerHistoryView } from './customerHistoryView.js';
import { getCustomerOrderHistory } from '../../infrastructure/repositories/customerOrderRepository.js';
import { supabase } from '../../infrastructure/config/supabase.js';

/**
 * Mengunduh QR Code dari URL cloud ke perangkat user menggunakan teknik Fetch Blob
 * untuk menghindari masalah CORS yang muncul jika menggunakan tag <a download> biasa.
 * @param {string} imageUrl - URL publik gambar QR Code
 * @param {string} orderId  - ID pesanan (digunakan untuk nama file)
 */
async function downloadQRCode(imageUrl, orderId) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `FRESHFREEZE_QR_${orderId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Bersihkan memori blob agar tidak bocor
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Gagal mengunduh QR Code:", error);
        alert("Gagal mengunduh gambar. Silakan klik kanan pada gambar QR dan pilih 'Simpan Gambar'.");
    }
}

export async function initCustomerHistoryController() {
    const appDiv = document.getElementById('app');

    // 1. Render skeleton layout terlebih dahulu
    appDiv.innerHTML = customerHistoryView.renderLayout();

    // 2. Cek sesi user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.hash = '#/login';
        return;
    }

    const container = document.getElementById('customer-orders-container');

    try {
        // 3. Ambil data riwayat pesanan customer yang sedang login
        const orders = await getCustomerOrderHistory(session.user.id);

        // 4. Render kartu pesanan ke dalam DOM
        container.innerHTML = customerHistoryView.renderOrders(orders);

    } catch (error) {
        console.error("Gagal memuat riwayat pesanan:", error);
        container.innerHTML = `
            <div style="background: #fff; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 40px; text-align: center;">
                <p style="color: #EF4444; margin: 0 0 8px 0; font-weight: 600;">⚠️ Gagal Memuat Data</p>
                <p style="color: #888; margin: 0; font-size: 0.9rem;">${error.message}</p>
            </div>
        `;
    }

    // 5. Pasang Event Delegation untuk tombol unduh QR Code
    //    Satu listener di container menangkap semua klik pada .btn-download-qr
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-download-qr');
        if (btn) {
            const qrUrl = btn.getAttribute('data-qr-url');
            const orderId = btn.getAttribute('data-order-id');
            if (qrUrl && orderId) {
                downloadQRCode(qrUrl, orderId);
            }
        }
    });
}
