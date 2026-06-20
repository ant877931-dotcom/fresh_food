import { authUseCase } from '../../domain/usecases/authUseCase.js';

export function initRegisterController() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return console.error('Form register tidak ditemukan di DOM!');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah halaman me-refresh
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log("Mencoba register dengan email:", email, "dan nama:", name); // LOG 1

        try {
            // Panggil usecase/repository Supabase di sini
            const result = await authUseCase.register(email, password, name);
            console.log("Hasil register:", result); // LOG 2
            
            // Redirect jika sukses
            alert("Registrasi Berhasil! Silakan login.");
            window.location.hash = '#/login'; 
        } catch (error) {
            console.error("Error saat register:", error.message); // LOG ERROR UTAMA
            alert("Gagal Register: " + error.message);
        }
    });
}
