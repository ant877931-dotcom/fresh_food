// src/infrastructure/repositories/customerOrderRepository.js
import { supabase } from '../config/supabase.js';

export async function getCustomerOrderHistory(userId) {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            id, created_at, total_amount, status, payment_type,
            order_items ( quantity, price_at_time, foods ( name ) ),
            invoices ( qr_code_url )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}
