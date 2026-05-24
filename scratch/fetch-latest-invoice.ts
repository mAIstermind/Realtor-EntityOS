import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any,
});

async function main() {
  console.log("Fetching latest invoices from Stripe...");
  const invoices = await stripe.invoices.list({ limit: 3 });
  for (const inv of invoices.data as any[]) {
    console.log(`Invoice ID: ${inv.id}`);
    console.log(`- Customer ID: ${inv.customer}`);
    console.log(`- Subscription ID: ${inv.subscription}`);
    console.log(`- Total: ${inv.total}`);
    console.log(`- Status: ${inv.status}`);
    console.log(`- Payment Intent (expanded?):`, JSON.stringify(inv.payment_intent, null, 2));
    console.log(`- Collection Method: ${inv.collection_method}`);
    console.log(`- Auto Advance: ${inv.auto_advance}`);
    console.log("------------------------------------------------");
  }
}

main().catch(console.error);
