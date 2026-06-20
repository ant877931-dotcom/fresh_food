// src/infrastructure/repositories/authRepository.js
import { supabase } from '../config/supabase.js';
import { User } from '../../domain/entities/User.js';

export const authRepository = {
  /**
   * Mendaftarkan user baru dan membuat entri di tabel profiles
   */
  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Gagal mendaftar, user tidak ditemukan.");

    // Coba insert ke tabel profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: data.user.id, full_name: fullName }
      ]);
    
    if (profileError) throw profileError;

    return data.user;
  },

  /**
   * Login user dengan email dan password
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  },

  /**
   * Logout session saat ini
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Mengambil session user saat ini beserta profil (role) nya
   */
  async getCurrentSessionUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (!session || !session.user) return null;

    // Ambil data profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error("Gagal mengambil profil:", profileError);
      // Fallback ke entitas default jika profil gagal diambil
      return new User({ id: session.user.id, email: session.user.email, role: 'customer' });
    }

    return new User(profile);
  },

  /**
   * Mengirim email reset password
   */
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};
