import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. TANGANI PREFLIGHT REQUEST (WAJIB UNTUK MENGATASI CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order_id, total_amount } = await req.json()

    // 2. REQUEST KE MIDTRANS
    // Perhatikan tanda titik dua ":" di akhir Server Key sebelum di-encode Base64
    const serverKeyBase64 = btoa('SB-Mid-server-EglgwV4vUg8Pt4H_w5XhxXva:'); 

    const midtransResponse = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${serverKeyBase64}`
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: order_id,
          // Midtrans mewajibkan nilai gross_amount berupa angka bulat (integer)
          gross_amount: Math.round(total_amount) 
        }
      })
    })

    const data = await midtransResponse.json()

    // 3. KEMBALIKAN TOKEN KE FRONTEND (DENGAN CORS HEADERS)
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})