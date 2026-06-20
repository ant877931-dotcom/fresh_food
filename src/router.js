import { supabase } from './infrastructure/config/supabase.js';
import { renderLogin } from './presentation/auth/login.js';
import { renderRegister } from './presentation/auth/register.js';
import { katalogView } from './presentation/customer/katalogView.js';

function handleRoute() {
    const appDiv = document.getElementById('app');
    const publicNavbar = document.getElementById('navbar');
    // Ambil hash, pastikan membersihkan karakter '?' jika browser menambahkannya secara tak terduga
    let hash = window.location.hash.replace('?', ''); 

    // Jika user baru membuka web (tanpa hash), arahkan ke login
    if (hash === '' || hash === '#' || hash === '#/') {
        window.location.hash = '#/login';
        return;
    }

    if (publicNavbar) {
        if (hash === '#/admin') {
            publicNavbar.style.display = 'none';
        } else {
            publicNavbar.style.display = 'flex';
        }
    }

    if (hash === '#/katalog') {
        appDiv.innerHTML = katalogView.renderLayout(); 
        // Panggil controller utama untuk mengambil data & event listener
        import('./presentation/customer/katalogController.js').then(({ katalogController }) => {
            katalogController.renderKatalog();
        });
    } else if (hash === '#/login') {
        appDiv.innerHTML = renderLogin(); // 1. Render HTML-nya dulu
        import('./presentation/auth/loginController.js').then(({ initLoginController }) => {
            initLoginController();            // 2. BARU pasang event listener-nya
        });
    } else if (hash === '#/register') {
        appDiv.innerHTML = renderRegister(); 
        import('./presentation/auth/registerController.js').then(({ initRegisterController }) => {
            initRegisterController();            
        });
    } else if (hash === '#/admin') {
        import('./presentation/admin/adminDashboardController.js').then(({ adminDashboardController }) => {
            adminDashboardController.init();
        });
    } else if (hash === '#/riwayat-pesanan') {
        import('./presentation/customer/riwayatView.js').then(({ renderRiwayatView }) => {
            appDiv.innerHTML = renderRiwayatView();
            import('./presentation/customer/riwayatController.js').then(({ initRiwayatController }) => {
                initRiwayatController();
            });
        });
    } else {
        appDiv.innerHTML = '<div style="text-align:center; padding:50px;"><h2>404 Not Found</h2><a href="#/">Kembali ke Katalog</a></div>';
    }
}

export async function updateNavbar() {
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return; // Prevent error if it doesn't exist on some pages
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        // Jika SUDAH login
        navActions.innerHTML = `
            <a href="#/riwayat-pesanan" style="margin-right: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; color: #555; border: 1px solid #ddd; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Pesanan Saya
            </a>
            <button id="btn-logout" style="cursor: pointer; background: transparent; color: #1A1A1A; border: 1px solid #1A1A1A; padding: 8px 16px; border-radius: 20px;">Logout</button>
        `;

        // Pasang event listener untuk logout
        document.getElementById('btn-logout').addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.hash = '#/login'; // Redirect ke login setelah logout
            updateNavbar(); // Perbarui tampilan navbar kembali
        });
    } else {
        // Jika BELUM login
        navActions.innerHTML = `
            <a href="#/login" style="margin-right: 15px; text-decoration: none; color: var(--c-dark-green, #0E6B38); border: 1.5px solid var(--c-dark-green, #0E6B38); padding: 8px 16px; border-radius: 20px; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='#0E6B38'; this.style.color='#fff';" onmouseout="this.style.background='transparent'; this.style.color='var(--c-dark-green, #0E6B38)';">Login</a>
            <a href="#/register" style="text-decoration: none; background: var(--primary, #16A34A); color: var(--primary-text, #FFFFFF); padding: 8px 16px; border-radius: 20px; font-weight: 700; transition: all 0.2s;" onmouseover="this.style.background='#15803D';" onmouseout="this.style.background='var(--primary, #16A34A)';">Register</a>
        `;
    }
}

window.addEventListener('hashchange', () => {
    updateNavbar();
    handleRoute();
});
window.addEventListener('DOMContentLoaded', () => {
    updateNavbar(); // Pastikan navbar dirender saat web pertama kali dibuka
    handleRoute();
});
