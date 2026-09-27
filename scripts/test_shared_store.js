import fetch from 'node-fetch';

const SHARED_STORE_URL = 'https://api.jsonbin.io/v3/b/66f44537e41b4d34e437c35d'; // Test endpoint

async function testSharedSync() {
  console.log('Testing shared cloud sync...');
  try {
    const res = await fetch('https://api.myjson.online/v1/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'odflow_apps', data: [] })
    });
    const data = await res.json();
    console.log('MyJSON response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testSharedSync();
