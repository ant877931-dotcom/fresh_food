// src/domain/usecases/authUseCase.js
import { authRepository } from '../../infrastructure/repositories/authRepository.js';

export const authUseCase = {
  /**
   * Eksekusi login
   */
  async login(email, password) {
    if (!email || !password) throw new Error("Email dan password wajib diisi");
    return await authRepository.signIn(email, password);
  },

  /**
   * Eksekusi register
   */
  async register(email, password, fullName) {
    if (!email || !password || !fullName) throw new Error("Semua field wajib diisi");
    if (password.length < 6) throw new Error("Password minimal 6 karakter");
    return await authRepository.signUp(email, password, fullName);
  },

  /**
   * Eksekusi logout
   */
  async logout() {
    await authRepository.signOut();
  },

  /**
   * Dapatkan user session dan profile saat ini
   */
  async getCurrentSession() {
    return await authRepository.getCurrentSessionUser();
  },

  /**
   * Lupa password
   */
  async forgotPassword(email) {
    if (!email) throw new Error("Email wajib diisi");
    await authRepository.resetPassword(email);
  }
};
