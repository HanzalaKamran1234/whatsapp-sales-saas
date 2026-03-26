const fs = require('fs');

async function test() {
  const env = fs.readFileSync('.env.local', 'utf-8');
  let url = '', key = '';
  env.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = line.replace('SUPABASE_SERVICE_ROLE_KEY=', '').trim();
  });

  console.log("Testing POST to Products table with new schema...");

  const res = await fetch(`${url}/rest/v1/products`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      name: 'Test Product',
      price: 'PKR 100',
      description: 'Test',
      user_id: 'user_2xyz123abc'
    })
  });

  const json = await res.json().catch(() => ({}));
  console.log("Status:", res.status);
  console.log("Body:", json);
}
test();
