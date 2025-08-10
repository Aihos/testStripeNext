import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);


export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Produit test' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
       success_url: "http://localhost:3001/success", 
      cancel_url: "http://localhost:3000/cancel", 
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur création session Stripe' }, { status: 500 });
  }
}
