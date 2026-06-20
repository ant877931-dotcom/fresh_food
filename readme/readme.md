# FreshFood - Smart Food Ordering 🥗

FreshFood adalah evolusi dari sistem pemesanan makanan digital dengan perombakan antarmuka pengguna (UI/UX) yang difokuskan pada tema hijau segar (Green Theme). Sistem ini mengedepankan alur transaksi yang efisien dan cepat, mulai dari pemilihan makanan hingga verifikasi pesanan. 

Proyek ini berada di dalam direktori `food_ordering` dan berjalan pada infrastruktur Supabase mandiri untuk memastikan isolasi data yang aman.

## 🚀 Fitur Utama & Teknologi
* **Autentikasi Terpusat:** Menggunakan Supabase Auth untuk keamanan sesi pengguna.
* **Manajemen Status Cerdas:** Alur pesanan yang disederhanakan (`Pending` -> `Paid` -> `Confirmed`).
* **Pembersihan Keranjang Otomatis (Auto-Clear Cart):** Meningkatkan pengalaman pengguna pasca-pembayaran.
* **Verifikasi Instan:** Penggunaan QR Code scanner untuk konfirmasi pesanan oleh Admin.

## 🔐 Akun Pengujian (Test Credentials)

Berikut adalah akun yang telah disiapkan untuk pengujian alur sistem FreshFood:

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `rayansaputra431@gmail.com` | `123456` | Memantau riwayat transaksi, update status ke *Confirmed*, dan kelola menu. |
| **Customer** | `do@gmail.com` | `123456` | Membuat pesanan baru, melakukan simulasi pembayaran, dan melihat QR pesanan. |

## 🛠️ Persiapan Lingkungan (Setup)
1. Pastikan Anda berada di dalam folder `food_ordering`.
2. Jika ini pertama kali menjalankan proyek setelah pergantian database, pastikan untuk **membersihkan Local Storage** di browser Anda terlebih dahulu.
3. Jalankan file `index.html` menggunakan **Live Server** di VS Code.
4. Gunakan kredensial di atas untuk masuk ke dalam sistem.