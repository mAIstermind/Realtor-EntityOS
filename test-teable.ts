import fetch from 'node-fetch';

const token = 'teable_accXXZrNentZbczYXBq_jH3AWZb2HYSJVhCZutsNu9FV2cAyDX6rn17iM9tuBZk=';
const baseUrl = 'https://app.teable.io/api';
const baseId = 'bsexlZrrejsIgF7SoK4';
const profilesTableId = 'tblWclyP1kzKFMTJaVv';

async function examineRawSchema() {
  try {
    console.log('Fetching Agent_Profiles raw schema...');
    const schemaRes = await fetch(`${baseUrl}/base/${baseId}/table/${profilesTableId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const schema = await schemaRes.json() as any;
    console.log('Raw Schema Response:', JSON.stringify(schema, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

examineRawSchema();
