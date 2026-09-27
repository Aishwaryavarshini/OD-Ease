import fetch from 'node-fetch';

const objectId = 'ff808181a09d98f701a0d94352151538';
const url = `https://api.restful-api.dev/objects/${objectId}`;

async function testSync() {
  console.log('Testing PUT to restful-api.dev...');
  const testApps = [
    { id: 'app101', studentName: 'TEST STUDENT', event: 'National Symposium', status: 'Pending Mentor Approval' }
  ];

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'ODFlow Shared Storage',
      data: { applications: testApps }
    })
  });
  console.log('PUT Status:', putRes.status);
  const putData = await putRes.json();
  console.log('PUT Response:', putData);

  // Now GET
  const getRes = await fetch(url);
  const getOutput = await getRes.json();
  console.log('GET Result applications count:', getOutput.data?.applications?.length);
  console.log('GET Result data:', getOutput.data);
}

testSync();
