import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Supprimez cette configuration qui est pour Pages Router
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// Utilisez la variable d'environnement côté serveur (sans NEXT_PUBLIC_)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Erreur signature webhook', err);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    await prisma.payment.create({
      data: {
        stripeId: session.id,
        amount: session.amount_total!,
        status: 'SUCCEEDED',
      },
    });
  }

  return NextResponse.json({ received: true });
}