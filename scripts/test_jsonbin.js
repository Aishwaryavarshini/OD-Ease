import fetch from 'node-fetch';

async function testJsonBin() {
  console.log('Testing JSONBin endpoint...');
  try {
    // Create bin
    const createRes = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$vM6r9C9g/5dGj3wF3n2V3.H3B0b1r9H.zV5K.k1Z9k1Z9k1Z9k1Z9',
        'X-Bin-Name': 'odflow_shared_apps',
        'X-Bin-Private': 'false'
      },
      body: JSON.stringify([])
    });

    const createData = await createRes.json();
    console.log('Create Bin response:', createData);
  } catch (err) {
    console.error('Jsonbin error:', err.message);
  }
}

testJsonBin();
