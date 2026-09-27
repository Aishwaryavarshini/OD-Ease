import fetch from 'node-fetch';

async function testNPoint() {
  console.log('Creating npoint bin...');
  try {
    const res = await fetch('https://api.npoint.io/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apps: [] })
    });
    const data = await res.json();
    console.log('Bin created! ID:', data.id);
    
    // Now test GET and POST to that bin ID
    const binUrl = `https://api.npoint.io/${data.id}`;
    const getRes = await fetch(binUrl);
    console.log('GET bin data:', await getRes.json());
  } catch (err) {
    console.error('npoint error:', err.message);
  }
}

testNPoint();
