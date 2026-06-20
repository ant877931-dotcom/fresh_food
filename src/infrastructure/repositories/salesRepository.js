import { supabase } from '../config/supabase.js';

export const salesRepository = {
  async getOrdersData() {
    // JOIN orders with order_items and foods to get food name
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price_at_time,
          foods (
            name,
            category_id
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
    return data;
  }
};
