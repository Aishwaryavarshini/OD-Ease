import fetch from 'node-fetch';

async function testKeyValue() {
  console.log('Testing shared cloud key-value store...');
  const storeId = 'odflow_prod_store_srm_trp_2026';
  
  try {
    // Put
    const putRes = await fetch(`https://api.npoint.io/46995642672583857321`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apps: [{ id: 'test1', name: 'Shared App' }] })
    });
    console.log('npoint status:', putRes.status);
    const data = await putRes.json();
    console.log('npoint response:', data);
  } catch (err) {
    console.error('npoint error:', err.message);
  }
}

testKeyValue();
