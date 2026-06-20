// src/domain/usecases/adminUseCase.js
import { adminRepository } from '../../infrastructure/repositories/adminRepository.js';

export const adminUseCase = {
  /**
   * Menambahkan makanan baru, termasuk upload gambar
   */
  async addFood(name, description, price, category, imageFile) {
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await adminRepository.uploadFoodImage(imageFile);
    }

    const foodData = {
      name,
      description,
      price: parseFloat(price),
      category,
      image_url: imageUrl
    };

    return await adminRepository.addFood(foodData);
  },

  /**
   * Mengupdate makanan (opsional upload gambar baru)
   */
  async updateFood(id, name, description, price, category, imageFile) {
    const foodData = {
      name,
      description,
      price: parseFloat(price),
      category
    };

    if (imageFile) {
      foodData.image_url = await adminRepository.uploadFoodImage(imageFile);
    }

    return await adminRepository.updateFood(id, foodData);
  },

  /**
   * Hapus makanan
   */
  async deleteFood(id) {
    return await adminRepository.deleteFood(id);
  },

  /**
   * Dapatkan Analytics pesanan
   */
  async getAnalytics(startDate, endDate) {
    const orders = await adminRepository.getOrdersByDateRange(startDate, endDate);
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.status === 'completed' || order.status === 'delivered' ? order.total_amount : 0), 0);
    const totalOrders = orders.length;

    return {
      orders,
      totalRevenue,
      totalOrders
    };
  },

  /**
   * Scan invoice dan konfirmasi
   */
  async scanInvoice(invoiceCode) {
    if (!invoiceCode) throw new Error("Kode Invoice kosong");
    return await adminRepository.verifyInvoiceAndCompleteOrder(invoiceCode);
  }
};
