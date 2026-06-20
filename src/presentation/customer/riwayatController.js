// src/presentation/customer/riwayatController.js
import { getCustomerOrderHistory } from '../../infrastructure/repositories/customerOrderRepository.js';
import { supabase } from '../../infrastructure/config/supabase.js';

function updateNavbarRiwayat() {
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return;

    // Pertahankan isi yang ada (cart icon dll) dan hanya tambahkan tombol logout
    // jika belum ada agar tidak duplikat
    if (document.getElementById('logout-btn')) return;

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.cssText = 'background: transparent; border: 1px solid var(--primary); color: var(--primary); padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s;';
    logoutBtn.onmouseover = () => { logoutBtn.style.background = 'var(--primary)'; logoutBtn.style.color = '#fff'; };
    logoutBtn.onmouseout  = () => { logoutBtn.style.background = 'transparent'; logoutBtn.style.color = 'var(--primary)'; };

    // Cari wrapper flex di dalam nav-actions dan sisipkan tombol
    const wrapper = navActions.querySelector('div');
    if (wrapper) {
        wrapper.appendChild(logoutBtn);
    } else {
        navActions.appendChild(logoutBtn);
    }

    logoutBtn.addEventListener('click', async () => {
        const confirmLogout = confirm('Apakah Anda yakin ingin keluar?');
        if (!confirmLogout) return;

        try {
            logoutBtn.textContent = 'Keluar...';
            logoutBtn.disabled = true;

            // 1. Akhiri sesi di backend Supabase
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // 2. Bersihkan keranjang belanja di LocalStorage demi keamanan
            localStorage.removeItem('cart');

            // 3. Arahkan kembali ke halaman Login
            window.location.hash = '#/login';

        } catch (err) {
            console.error('Logout Error:', err);
            alert('Gagal melakukan logout: ' + err.message);
            logoutBtn.textContent = 'Logout';
            logoutBtn.disabled = false;
        }
    });
}

export async function initRiwayatController() {
    const container = document.getElementById('riwayat-container');
    if (!container) return;

    try {
        // 1. Cek sesi user — redirect ke login jika belum masuk
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.hash = '#/login';
            return;
        }

        // 2. Navbar diatur oleh router.js, tidak perlu pasang tombol Logout manual

        // 3. Ambil riwayat pesanan dari repository
        const orders = await getCustomerOrderHistory(session.user.id);

        if (!orders || orders.length === 0) {
            container.innerHTML = `
                <div style="background: #fff; border-radius: 12px; padding: 60px 40px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.06);">
                    <div style="font-size: 3.5rem; margin-bottom: 12px;">🛒</div>
                    <p style="color: #999; margin: 0; font-size: 1rem;">Anda belum memiliki riwayat pesanan.</p>
                    <a href="#/katalog" style="display: inline-block; margin-top: 20px; background: var(--primary); color: var(--primary-text); text-decoration: none; padding: 10px 24px; border-radius: 20px; font-weight: 700;">Mulai Pesan</a>
                </div>
            `;
            return;
        }

        const statusConfig = {
            pending:   { label: 'PENDING',   bg: '#fff3cd', color: '#856404' },
            completed: { label: 'CONFIRMED', bg: 'var(--c-dark-green)', color: 'white', extraStyle: 'padding: 4px 12px; border-radius: 12px; font-weight: 700; font-size: 12px; border: none;' },
            confirmed: { label: 'CONFIRMED', bg: 'var(--c-dark-green)', color: 'white', extraStyle: 'padding: 4px 12px; border-radius: 12px; font-weight: 700; font-size: 12px; border: none;' },
            paid:      { label: 'PAID',      bg: '#d1ecf1', color: '#0c5460' },
        };

        // 4. Build HTML untuk setiap kartu pesanan
        let html = '';
        orders.forEach(order => {
            const cfg = statusConfig[order.status] || { label: order.status.toUpperCase(), bg: '#f3f4f6', color: '#555' };

            const itemsHtml = (order.order_items || []).map(item =>
                `<li style="padding: 4px 0; color: #555; font-size: 0.9rem;">${item.foods?.name || 'Makanan'} <span style="color: #888;">(×${item.quantity})</span></li>`
            ).join('');

            const formattedTotal = new Intl.NumberFormat('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0
            }).format(order.total_amount);

            const formattedDate = new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'long', timeStyle: 'short'
            }).format(new Date(order.created_at));

            // Ekstraksi aman: Supabase bisa mengembalikan array ATAU objek tunggal
            const invoice = Array.isArray(order.invoices) ? order.invoices[0] : order.invoices;
            const qrUrl = invoice?.qr_code_url;

            let qrHtml = '';
            if (order.status === 'completed' || order.status === 'confirmed' || order.status === 'paid') {
                if (qrUrl) {
                    qrHtml = `
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #e0e0e0; text-align: center;">
                            <p style="margin: 0 0 10px; font-size: 0.8rem; color: #888; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">QR Code Pengambilan</p>
                            <div style="display: inline-block; border: 3px solid var(--primary); border-radius: 10px; padding: 6px; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
                                <img src="${qrUrl}" alt="QR Code" style="width: 150px; height: 150px; display: block; border-radius: 6px;"
                                    onerror="this.style.display='none'">
                            </div>
                            <br>
                            <button 
                                class="btn-download-qr" 
                                data-url="${qrUrl}" 
                                data-id="${order.id}"
                                style="margin-top: 10px; background: #1A1A1A; color: #fff; padding: 9px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s;"
                                onmouseover="this.style.background='#333'"
                                onmouseout="this.style.background='#1A1A1A'"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="pointer-events:none;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/></svg>
                                Unduh QR Code
                            </button>
                        </div>
                    `;
                } else {
                    qrHtml = `<p style="color: var(--text-muted); font-size: 13px; margin: 12px 0 0; text-align: center;">🔄 QR Code sedang diproses...</p>`;
                }
            } else {
                qrHtml = `<p style="color: var(--text-muted); font-size: 13px; margin: 12px 0 0; text-align: center;">⏳ Selesaikan pembayaran untuk mendapatkan QR Code</p>`;
            }

            html += `
                <div style="background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 22px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.10)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; gap: 8px; flex-wrap: wrap;">
                        <div>
                            <div style="font-size: 0.72rem; color: #aaa; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">ID Pesanan</div>
                            <div style="font-family: monospace; font-weight: 700; color: #1A1A1A; font-size: 0.95rem;">#${order.id.split('-')[0].toUpperCase()}</div>
                            <div style="font-size: 0.8rem; color: #999; margin-top: 3px;">${formattedDate}</div>
                        </div>
                        <span style="background: ${cfg.bg}; color: ${cfg.color}; ${cfg.extraStyle || 'padding: 5px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; border: none;'} white-space: nowrap;">
                            ${cfg.label}
                        </span>
                    </div>

                    <ul style="padding-left: 18px; margin: 0 0 14px; list-style: disc;">
                        ${itemsHtml || '<li style="color:#ccc;">Tidak ada item</li>'}
                    </ul>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 2px solid #f3f4f6;">
                        <span style="color: #555; font-weight: 500;">Total Pembayaran</span>
                        <span style="font-weight: 800; color: var(--c-dark-green); font-size: 1.05rem;">${formattedTotal}</span>
                    </div>

                    ${qrHtml}
                </div>
            `;
        });

        container.innerHTML = html;

        // 5. Event Delegation untuk tombol unduh QR (Fetch Blob)
        container.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-download-qr');
            if (!btn) return;

            const url = btn.getAttribute('data-url');
            const id  = btn.getAttribute('data-id');
            const originalText = btn.innerHTML;

            btn.textContent = 'Mengunduh...';
            btn.disabled = true;

            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `FRESHFREEZE_QR_${id}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            } catch (err) {
                console.error("Gagal mengunduh QR Code:", err);
                alert("Gagal mengunduh gambar. Silakan klik kanan pada gambar QR dan pilih 'Simpan Gambar'.");
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });

    } catch (error) {
        console.error("Error memuat riwayat pesanan:", error);
        container.innerHTML = `
            <div style="background: #fff; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.06);">
                <p style="color: #EF4444; font-weight: 600; margin: 0 0 6px;">⚠️ Gagal Memuat Riwayat</p>
                <p style="color: #888; margin: 0; font-size: 0.9rem;">${error.message}</p>
            </div>
        `;
    }
}
