// src/domain/usecases/historyUseCase.js
import { historyRepository } from '../../infrastructure/repositories/historyRepository.js';

export const historyUseCase = {
  /**
   * Mendapatkan daftar riwayat pesanan milik pelanggan
   * @param {string} userId 
   */
  async getOrders(userId) {
    if (!userId) throw new Error("User ID dibutuhkan untuk mengambil riwayat.");
    return await historyRepository.getCustomerOrders(userId);
  }
};
