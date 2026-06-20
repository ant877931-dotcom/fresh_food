// src/infrastructure/repositories/orderRepository.js
import { supabase } from '../config/supabase.js';

export const orderRepository = {
  /**
   * Menyisipkan order baru ke tabel orders dan order_items
   * @param {string} userId 
   * @param {Array} items 
   * @param {number} totalAmount 
   * @returns {Object} { orderId }
   */
  async createOrder(userId, items, totalAmount) {
    try {
      // 1. Buat record di tabel orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: userId,
          total_amount: totalAmount,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderId = orderData.id;

      // 2. Buat record di tabel order_items
      const orderItems = items.map(item => ({
        order_id: orderId,
        food_id: item.foodId,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return { orderId };
    } catch (error) {
      console.error("Gagal membuat order:", error);
      throw new Error("Gagal membuat order di database.");
    }
  }
};
