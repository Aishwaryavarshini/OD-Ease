import net from 'net';

function checkPort(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(4000);
    socket.on('connect', () => {
      console.log(`Port ${port} on ${host} is OPEN!`);
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      console.log(`Port ${port} on ${host} TIMED OUT.`);
      socket.destroy();
      resolve(false);
    });
    socket.on('error', (err) => {
      console.log(`Port ${port} on ${host} ERROR:`, err.message);
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function run() {
  const hosts = [
    'envvlypkrqvdepkwbwfi.supabase.co',
    'db.envvlypkrqvdepkwbwfi.supabase.co'
  ];
  for (const host of hosts) {
    for (const port of [5432, 6543, 443]) {
      await checkPort(host, port);
    }
  }
}

run();
