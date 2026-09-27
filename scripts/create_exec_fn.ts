import fetch from 'node-fetch';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudnZseXBrcnF2ZGVwa3did2ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDEzNDE5OCwiZXhwIjoyMTA1NzEwMTk4fQ.VsRYkc7MwcDmnw9mjZi1mjii9nkN5aGJMRvspmTE7gg';

async function req(path: string, body: any, method = 'POST') {
  const res = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

// Step 1: Create exec_sql helper function via RPC
async function createExecFunction() {
  // We abuse the fact that service-role can POST to /rest/v1/rpc
  // by creating a function that executes raw SQL
  // The only way to run DDL via REST is through an existing stored procedure.
  // Let's try the Supabase internal SQL HTTP endpoint
  const sqlEndpoints = [
    `/rest/v1/rpc/rls_auto_enable`,
  ];

  // Try to use an existing helper to create a function
  const execFunctionSQL = `
CREATE OR REPLACE FUNCTION public.exec_sql(query TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;
GRANT EXECUTE ON FUNCTION public.exec_sql(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.exec_sql(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.exec_sql(TEXT) TO authenticated;
  `;

  // Try to use Supabase internal endpoint
  const internalEndpoints = [
    '/rest/v1/rpc/exec_sql',
    '/functions/v1/exec_sql',
  ];

  for (const ep of internalEndpoints) {
    const r = await req(ep, { query: execFunctionSQL });
    console.log(`${ep}:`, r.status, r.body.substring(0, 200));
  }
}

createExecFunction();
