// MercadoPago Checkout Pro integration
// In production, set VITE_MP_BACKEND_URL to your backend endpoint.
// The backend must POST to https://api.mercadopago.com/checkout/preferences
// using your MP Access Token (SECRET — never expose client-side).

const BACKEND_URL = import.meta.env.VITE_MP_BACKEND_URL

export async function createPreference({ items, payer, orderId, backUrls }) {
  if (!BACKEND_URL) {
    // Demo mode — simulate backend latency, return a mock preference
    await new Promise(r => setTimeout(r, 1400))
    return {
      id: `DEMO-${orderId}`,
      init_point: null,
      demo: true,
    }
  }

  const res = await fetch(`${BACKEND_URL}/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: items.map(i => ({
        id:          String(i.id),
        title:       i.name,
        quantity:    i.qty,
        unit_price:  i.price,
        currency_id: 'ARS',
      })),
      payer,
      external_reference: orderId,
      back_urls: backUrls,
      auto_return: 'approved',
    }),
  })

  if (!res.ok) throw new Error('Error al crear preferencia de pago.')
  return res.json()
}
