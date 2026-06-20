import { supabase } from '../../infrastructure/config/supabase.js';

export function initLoginController() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return console.error('Form login tidak ditemukan di DOM!');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah halaman me-refresh
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log("Mencoba login dengan:", email); // LOG 1

        try {
            // 1. Lakukan Login
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;

            // 2. Ambil Role dari tabel profiles berdasarkan ID user yang login
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authData.user.id)
                .single();

            if (profileError) throw profileError;

            // 3. Arahkan ke rute yang tepat berdasarkan role
            if (profileData.role === 'admin') {
                window.location.hash = '#/admin';
            } else {
                window.location.hash = '#/katalog'; // Customer dikembalikan ke katalog
            }
        } catch (error) {
            console.error("Login gagal:", error.message);
            alert("Gagal Login: " + error.message);
        }
    });
}
