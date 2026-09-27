import fetch from 'node-fetch';

async function testCrud() {
  console.log('Testing CRUD store...');
  try {
    const res = await fetch('https://crudcrud.com/api/5a3d7e8b9f0a4b1c2d3e4f5a6b7c8d9e/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test App', timestamp: Date.now() })
    });
    console.log('CrudCrud Status:', res.status);
    const data = await res.json();
    console.log('CrudCrud Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testCrud();
