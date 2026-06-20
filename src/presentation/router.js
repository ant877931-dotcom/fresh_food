import { renderLogin } from './auth/login.js';
import { renderRegister } from './auth/register.js';
import { katalogController } from './customer/katalogController.js'; // Import renderCatalog dari path yang sesuai

const appDiv = document.getElementById('app'); // Sesuaikan dengan ID container utama di index.html

export function handleRoute() {
    let hash = window.location.hash.replace('?', '');

    if (hash === '' || hash === '#' || hash === '#/' || hash === '#/katalog') {
        appDiv.innerHTML = ''; // Panggil fungsi renderCatalog() di sini
        katalogController.renderKatalog();
    } else if (hash === '#/login') {
        appDiv.innerHTML = renderLogin();
        // Nanti tambahkan event listener untuk form login di sini
    } else if (hash === '#/register') {
        appDiv.innerHTML = renderRegister();
        // Nanti tambahkan event listener untuk form register di sini
    } else if (hash === '#/admin') {
        appDiv.innerHTML = '<h2>Dashboard Admin (Dalam Pengembangan)</h2>';
    } else {
        appDiv.innerHTML = '<h2>404 Not Found</h2>';
    }
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);
