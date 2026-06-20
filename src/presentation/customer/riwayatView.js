// src/presentation/customer/riwayatView.js

export function renderRiwayatView() {
    return `
        <div style="max-width: 800px; margin: 40px auto; padding: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px;">
                <h2 style="margin: 0; color: var(--text-main); font-size: 1.8rem; font-weight: 800;">Riwayat Pesanan Saya</h2>
                <a href="#/katalog" style="text-decoration: none; color: #555; border: 1px solid #ddd; padding: 8px 18px; border-radius: 20px; font-size: 0.9rem; background: #fff; display: inline-flex; align-items: center; gap: 6px;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">
                    ← Kembali ke Katalog
                </a>
            </div>
            <div id="riwayat-container">
                <div style="text-align: center; padding: 60px 0; color: #aaa;">
                    <div style="width: 36px; height: 36px; border: 3px solid var(--primary); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 14px;"></div>
                    <p style="margin: 0;">Memuat pesanan...</p>
                </div>
            </div>
        </div>
        <style>
            @keyframes spin { to { transform: rotate(360deg); } }
        </style>
    `;
}
