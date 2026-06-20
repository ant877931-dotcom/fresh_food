// src/presentation/customer/customerHistoryView.js

export const customerHistoryView = {
    renderLayout() {
        return `
            <div style="min-height: 100vh; background: #F7F8FA; padding: 40px 20px;">
                <div style="max-width: 780px; margin: 0 auto;">

                    <!-- Header -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <h1 style="margin: 0 0 6px 0; font-size: 2rem; font-weight: 800; color: var(--text-main);">Pesanan Saya</h1>
                            <p style="margin: 0; color: #888; font-size: 0.95rem;">Riwayat transaksi dan QR Code pengambilan makanan Anda</p>
                        </div>
                        <a href="#/katalog" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none; color: #555; border: 1px solid #ddd; padding: 9px 18px; border-radius: 20px; font-size: 0.9rem; background: #fff; transition: background 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='#fff'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            Kembali ke Katalog
                        </a>
                    </div>

                    <!-- Orders Container -->
                    <div id="customer-orders-container">
                        <div style="text-align: center; padding: 60px 20px; color: #aaa;">
                            <div style="width: 40px; height: 40px; border: 3px solid var(--primary); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px auto;"></div>
                            <p style="margin: 0; font-size: 0.95rem;">Memuat riwayat pesanan...</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
    },

    renderOrders(orders) {
        if (!orders || orders.length === 0) {
            return `
                <div style="background: #fff; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 60px 40px; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 16px;">🛒</div>
                    <h3 style="margin: 0 0 8px 0; color: #333; font-size: 1.2rem;">Belum Ada Pesanan</h3>
                    <p style="margin: 0 0 24px 0; color: #888;">Anda belum melakukan transaksi apapun. Yuk, mulai pesan makanan favorit Anda!</p>
                    <a href="#/katalog" style="display: inline-block; background: var(--primary); color: var(--primary-text); text-decoration: none; padding: 12px 28px; border-radius: 24px; font-weight: 700; font-size: 0.95rem;">Lihat Menu</a>
                </div>
            `;
        }

        const formatPrice = (price) =>
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

        const formatDate = (dateString) =>
            new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(dateString));

        const statusConfig = {
            pending: {
                label: 'Belum Dibayar',
                bg: '#FFF8E1',
                color: '#F59E0B',
                dot: '#F59E0B'
            },
            paid: {
                label: 'Sudah Dibayar · Siap Diambil',
                bg: '#86EFAC',
                color: '#064E3B',
                dot: '#064E3B'
            },
            completed: {
                label: 'Selesai Diambil',
                bg: 'var(--primary)',
                color: 'white',
                dot: 'white',
                extraStyle: 'padding: 4px 12px; border-radius: 12px; font-weight: 700; font-size: 12px;'
            },
            confirmed: {
                label: 'Selesai Diambil',
                bg: 'var(--primary)',
                color: 'white',
                dot: 'white',
                extraStyle: 'padding: 4px 12px; border-radius: 12px; font-weight: 700; font-size: 12px;'
            }
        };

        return orders.map(order => {
            const cfg = statusConfig[order.status] || { label: order.status, bg: '#F3F4F6', color: '#6B7280', dot: '#6B7280' };

            // Invoice & QR
            const invoiceArr = Array.isArray(order.invoices) ? order.invoices : (order.invoices ? [order.invoices] : []);
            const invoice = invoiceArr[0] || null;
            const qrUrl = invoice?.qr_code_url || null;
            const showQR = (order.status === 'paid' || order.status === 'completed' || order.status === 'confirmed') && qrUrl;

            // Items HTML
            const itemsHtml = (order.order_items || []).map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #F3F4F6;">
                    <span style="color: #555; font-size: 0.9rem;">
                        <span style="font-weight: 600; color: #333;">${item.quantity}×</span>
                        ${item.foods?.name || 'Produk'}
                    </span>
                    <span style="color: #888; font-size: 0.85rem;">${formatPrice(item.price_at_time * item.quantity)}</span>
                </div>
            `).join('');

            // QR Section
            const qrSection = showQR ? `
                <div style="border-top: 1px solid #F0F0F0; padding-top: 20px; margin-top: 20px; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                    <p style="margin: 0; font-size: 0.8rem; color: #888; text-align: center; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">QR Code Pengambilan</p>
                    <div style="border: 3px solid var(--primary); border-radius: 12px; padding: 8px; background: #fff; display: inline-block; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                        <img 
                            src="${qrUrl}" 
                            alt="QR Code Pesanan ${order.id.substring(0,8).toUpperCase()}" 
                            style="width: 140px; height: 140px; object-fit: contain; display: block; border-radius: 6px;"
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                        />
                        <div style="display:none; width:140px; height:140px; align-items:center; justify-content:center; color:#ccc; font-size:0.75rem; text-align:center;">QR tidak tersedia</div>
                    </div>
                    <button 
                        class="btn-download-qr" 
                        data-qr-url="${qrUrl}" 
                        data-order-id="${order.id}"
                        style="display: inline-flex; align-items: center; gap: 8px; background: var(--primary); color: var(--primary-text); border: none; padding: 10px 22px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                        onmouseover="this.style.opacity='0.9'"
                        onmouseout="this.style.opacity='1'"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="pointer-events:none;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                        Unduh QR Code
                    </button>
                </div>
            ` : (order.status === 'pending' ? `
                <div style="border-top: 1px solid #F0F0F0; padding-top: 16px; margin-top: 16px; text-align: center;">
                    <p style="margin: 0; font-size: 0.85rem; color: #8B7355;">⏳ Selesaikan pembayaran untuk mendapatkan QR Code pengambilan</p>
                </div>
            ` : '');

            return `
                <div style="background: #fff; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 24px; margin-bottom: 20px; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 24px rgba(0,0,0,0.10)'" onmouseout="this.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'">
                    
                    <!-- Card Header -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <div style="font-size: 0.75rem; color: #aaa; margin-bottom: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">ID Pesanan</div>
                            <div style="font-weight: 700; color: #1A1A1A; font-size: 1rem; font-family: monospace; letter-spacing: 0.03em;">#${order.id.substring(0,8).toUpperCase()}</div>
                            <div style="font-size: 0.8rem; color: #aaa; margin-top: 4px;">${formatDate(order.created_at)}</div>
                        </div>
                        <div style="display: inline-flex; align-items: center; gap: 6px; background: ${cfg.bg}; color: ${cfg.color}; padding: 5px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; white-space: nowrap; ${cfg.extraStyle || ''}">
                            <span style="width: 7px; height: 7px; border-radius: 50%; background: ${cfg.dot}; display: inline-block; flex-shrink: 0;"></span>
                            ${cfg.label}
                        </div>
                    </div>

                    <!-- Items List -->
                    <div style="margin-bottom: 16px;">
                        ${itemsHtml || '<p style="color:#ccc; font-size:0.85rem; margin:0;">Detail item tidak tersedia.</p>'}
                    </div>

                    <!-- Total -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 2px solid #F3F4F6;">
                        <span style="color: #555; font-weight: 500;">Total Pembayaran</span>
                        <span style="font-weight: 800; color: var(--c-dark-green); font-size: 1.1rem;">${formatPrice(order.total_amount)}</span>
                    </div>

                    <!-- QR Section -->
                    ${qrSection}
                </div>
            `;
        }).join('');
    }
};
