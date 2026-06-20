// src/domain/usecases/checkoutUseCase.js
import { orderRepository } from '../../infrastructure/repositories/orderRepository.js';
import { midtransService } from '../../infrastructure/services/midtransService.js';
import { cartUseCase } from './cartUseCase.js';

export const checkoutUseCase = {
  /**
   * Proses checkout: Buat order dan dapatkan Snap Token, lalu panggil Snap UI
   * @param {string} userId 
   * @param {Object} userDetails { fullName, email }
   * @param {Array} cartItems 
   */
  async processCheckout(userId, userDetails, cartItems) {
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Keranjang kosong.");
    }

    // 1. Kalkulasi total
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 2. Simpan order ke database (Supabase)
    const { orderId } = await orderRepository.createOrder(userId, cartItems, totalAmount);

    // 3. Siapkan item_details untuk Midtrans
    const itemDetails = cartItems.map(item => ({
      id: item.foodId,
      price: item.price,
      quantity: item.quantity,
      name: item.name.substring(0, 50) // Midtrans max length constraint
    }));

    // 4. Panggil Midtrans Service untuk mendapatkan token
    const token = await midtransService.getSnapToken(orderId, totalAmount, {
      firstName: userDetails.fullName,
      email: userDetails.email
    }, itemDetails);

    // 5. Trigger Midtrans Snap UI
    return new Promise((resolve, reject) => {
      window.snap.pay(token, {
        onSuccess: function(result) {
          cartUseCase.clearCart(userId);
          alert("Pembayaran Berhasil! Pesanan Anda sedang diproses.");
          // Redirect ke halaman riwayat pesanan (Tahap 4)
          window.location.hash = '/';
          resolve(result);
        },
        onPending: function(result) {
          cartUseCase.clearCart(userId);
          alert("Menunggu pembayaran Anda.");
          window.location.hash = '/';
          resolve(result);
        },
        onError: function(result) {
          alert("Pembayaran Gagal.");
          reject(result);
        },
        onClose: function() {
          alert("Anda menutup pop-up pembayaran tanpa menyelesaikan transaksi.");
          resolve(null);
        }
      });
    });
  }
};
