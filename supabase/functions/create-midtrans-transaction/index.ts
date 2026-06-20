import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order_id, gross_amount, customer_details, item_details } = await req.json()

    // Server Key dari environment variables Supabase
    const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY')
    
    if (!MIDTRANS_SERVER_KEY) {
      throw new Error('Midtrans Server Key is missing in environment variables.')
    }

    const midtransAuthString = btoa(`${MIDTRANS_SERVER_KEY}:`)
    
    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${midtransAuthString}`
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: order_id || `ORDER-${Date.now()}`,
          gross_amount: gross_amount
        },
        credit_card: {
          secure: true
        },
        customer_details: customer_details || {
          first_name: "Customer",
          email: "customer@example.com"
        },
        item_details: item_details || []
      })
    })

    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})