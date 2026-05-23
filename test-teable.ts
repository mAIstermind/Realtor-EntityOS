import { teableDB } from './server/db/teable.js';

async function test() {
  const tableId = process.env.TEABLE_AGENT_PROFILES_TABLE_ID || 'tblWclyP1kzKFMTJaVv';
  console.log("Testing string filter:");
  const res1 = await teableDB.getRecords(tableId, { filter: `Stripe_Customer_ID='cus_MikeBerry123'` });
  console.log("Res1 Error:", res1?.message || "Success");

  console.log("Testing object filter with fieldName:");
  const res2 = await teableDB.getRecords(tableId, { 
    filter: {
      filterSet: [{ fieldName: 'Stripe_Customer_ID', operator: 'is', value: 'cus_MikeBerry123' }]
    }
  });
  console.log("Res2 Error:", res2?.message || "Success");
}
test();
