import { supabase } from './config/supabase.js';

export const paymentService = {
  /**
   * Memanggil Edge Function Supabase untuk membuat transaksi Midtrans
   * @param {Object} payload 
   * @returns {Promise<string>} snap_token
   */
  async createTransaction(payload) {
    try {
      // Panggilan asli ke Edge Function Supabase
      const { data, error } = await supabase.functions.invoke('create-midtrans-transaction', {
        body: payload
      });
      
      if (error) {
        console.warn('Edge Function failed, using mock token. Error:', error);
        return 'mock_snap_token_123';
      }
      
      return data.token; 
      
    } catch (error) {
      console.error('Payment Service Error:', error);
      // Fallback untuk development tanpa Supabase Pro/deployed function
      return 'mock_snap_token_123';
    }
  }
};
