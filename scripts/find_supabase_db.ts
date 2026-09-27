import net from 'net';

const regions = [
  'ap-south-1',
  'us-east-1',
  'us-west-1',
  'eu-central-1',
  'eu-west-1',
  'ap-southeast-1',
  'ap-northeast-1',
  'sa-east-1'
];

function testHostPort(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2500);
    socket.on('connect', () => {
      console.log(`[OPEN] ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
    socket.on('error', () => { socket.destroy(); resolve(false); });
    socket.connect(port, host);
  });
}

async function scanPoolers() {
  console.log('Scanning Supabase pooler hosts...');
  for (const r of regions) {
    const host = `aws-0-${r}.pooler.supabase.com`;
    await testHostPort(host, 6543);
    await testHostPort(host, 5432);
  }
}

scanPoolers();
