'use client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function HomePage() {
  const handlePay = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ amount: 2000 }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    const stripe = await stripePromise;
    if (stripe) await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Payer 20€</h1>
      <button onClick={handlePay}>Payer</button>
    </main>
  );
}
