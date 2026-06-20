// src/infrastructure/services/midtransService.js
import { supabase } from '../config/supabase.js';

export const midtransService = {
  /**
   * Mendapatkan Snap Token dengan memanggil Supabase Edge Function
   * @param {string} orderId 
   * @param {number} grossAmount 
   * @param {Object} userDetails { firstName, email }
   * @param {Array} itemDetails Array of { id, price, quantity, name }
   * @returns {string} Snap Token
   */
  async getSnapToken(orderId, grossAmount, userDetails, itemDetails) {
    try {
      const payload = {
        order_id: orderId,
        gross_amount: grossAmount,
        customer_details: {
          first_name: userDetails.firstName || 'Customer',
          email: userDetails.email || 'customer@example.com'
        },
        item_details: itemDetails.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name
        }))
      };

      const { data, error } = await supabase.functions.invoke('create-midtrans-transaction', {
        body: payload
      });

      if (error) throw error;
      if (!data || !data.token) {
        throw new Error("Token tidak diterima dari Midtrans");
      }

      return data.token;
    } catch (error) {
      console.error("Midtrans Service Error:", error);
      throw new Error("Gagal menghubungi layanan pembayaran Midtrans.");
    }
  }
};
