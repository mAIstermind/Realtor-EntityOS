import { teableDB } from './server/db/teable.js';

async function test() {
  const tableId = process.env.TEABLE_AGENT_PROFILES_TABLE_ID || 'tblWclyP1kzKFMTJaVv';
  console.log("Testing string filter with braces:");
  const res1 = await teableDB.getRecords(tableId, { filter: `{Stripe_Customer_ID}='cus_MikeBerry123'` });
  console.log("Res1 Error:", (res1 as any)?.message || "Success");
  console.log("Records length:", (res1 as any).data?.records?.length);
  
  console.log("Testing filterByTk:");
  const res2 = await teableDB.getRecords(tableId, { filterByTk: 'cus_MikeBerry123' });
  console.log("Res2 Error:", (res2 as any)?.message || "Success");
}
test();
