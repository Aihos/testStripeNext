'use client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PayButton() {
  const handleClick = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ amount: 2000 }), // 20€ en centimes
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    const stripe = await stripePromise;
    if (stripe) stripe.redirectToCheckout({ sessionId: data.id });
  };

  return <button onClick={handleClick}>Payer 20€</button>;
}
