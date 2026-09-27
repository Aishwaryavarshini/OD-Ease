import fetch from 'node-fetch';

async function testKVDB() {
  const secretKey = 'odflow_prod_store_2026';
  const url = `https://kvdb.io/8xK5Z8n9rU3wZq8Y1xP7kL/${secretKey}`;
  
  try {
    // Put test
    const putRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ id: 'test1', title: 'Shared Test App' }])
    });
    console.log('KVDB Put status:', putRes.status);

    // Get test
    const getRes = await fetch(url);
    const data = await getRes.json();
    console.log('KVDB Get data:', data);
  } catch (err) {
    console.error('KVDB error:', err.message);
  }
}

testKVDB();
