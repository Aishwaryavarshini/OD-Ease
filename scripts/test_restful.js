import fetch from 'node-fetch';

async function testRestful() {
  console.log('Testing restful-api.dev...');
  try {
    const res = await fetch('https://api.restful-api.dev/objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'ODFlow Shared Storage',
        data: { applications: [] }
      })
    });
    const data = await res.json();
    console.log('Restful API Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testRestful();
