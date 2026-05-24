import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any,
});

async function main() {
  console.log("Fetching recent subscriptions from Stripe...");
  const subs = await stripe.subscriptions.list({ limit: 5 });
  for (const sub of subs.data) {
    console.log(`Subscription: ${sub.id}`);
    console.log(`- Customer: ${sub.customer}`);
    console.log(`- Status: ${sub.status}`);
    console.log(`- Plan: ${sub.items.data[0]?.price?.id}`);
    
    // Fetch latest invoice
    if (sub.latest_invoice) {
      const invoice = (await stripe.invoices.retrieve(sub.latest_invoice as string, {
        expand: ['payment_intent'],
      })) as any;
      console.log(`- Invoice: ${invoice.id}`);
      console.log(`  - Status: ${invoice.status}`);
      console.log(`  - Total: ${invoice.total}`);
      console.log(`  - Has Payment Intent: ${!!invoice.payment_intent}`);
      if (invoice.payment_intent) {
        const pi = invoice.payment_intent as any;
        console.log(`  - Payment Intent Status: ${pi.status}`);
        console.log(`  - Client Secret: ${pi.client_secret ? 'EXISTS' : 'NONE'}`);
      }
    }
    console.log("-----------------------------------------");
  }
}

main().catch(console.error);
