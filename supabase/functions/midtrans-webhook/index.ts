import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const { order_id, transaction_status, status_code, signature_key, gross_amount } = payload

    // 1. Verifikasi Signature Key (opsional untuk keamanan ekstra)
    // const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY') || ''
    // const cryptoStr = order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY
    // Lakukan hashing SHA512 dan cocokkan dengan signature_key...

    // Inisialisasi Supabase Client (Admin / Service Role untuk by-pass RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are missing.')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 2. Evaluasi status transaksi
    let orderStatus = 'pending'
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      orderStatus = 'completed'
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      orderStatus = 'cancelled'
    }

    // 3. Update tabel orders
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status: orderStatus })
      .eq('id', order_id)
      .select()
      .single()

    if (updateError) throw updateError

    // 4. Jika status completed, buat invoice string unik dan simpan di tabel invoices
    if (orderStatus === 'completed') {
      // Cek apakah invoice sudah ada untuk menghindari duplikasi
      const { data: existingInvoice } = await supabase
        .from('invoices')
        .select('*')
        .eq('order_id', order_id)
        .single()
      
      if (!existingInvoice) {
        const invoiceCode = `INV-${Date.now()}-${order_id.substring(0, 4).toUpperCase()}`
        const { error: invoiceError } = await supabase
          .from('invoices')
          .insert([
            { order_id: order_id, invoice_code: invoiceCode }
          ])
        
        if (invoiceError) {
          console.error("Gagal membuat invoice:", invoiceError)
        }
      }
    }

    return new Response(
      JSON.stringify({ status: "ok", order_status: orderStatus }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
