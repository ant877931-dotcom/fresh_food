// src/domain/usecases/getFoodsUseCase.js
import { foodRepository } from '../../infrastructure/repositories/foodRepository.js';

export const getFoodsUseCase = {
  /**
   * Eksekusi use case untuk mengambil makanan
   * @param {string} searchQuery 
   * @param {string} category 
   */
  async execute(searchQuery = '', category = '') {
    try {
      return await foodRepository.getAllFoods(searchQuery, category);
    } catch (error) {
      console.error('getFoodsUseCase Error:', error);
      throw new Error('Gagal mengambil data makanan. Silakan coba lagi.');
    }
  }
};
