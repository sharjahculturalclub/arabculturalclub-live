const fetch = require('node-fetch');
const fs = require('fs');

async function run() {
  const query = `
    {
      __schema {
        types {
          name
        }
      }
    }
  `;
  const res = await fetch('http://backendshjarabclub.local/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  fs.writeFileSync('schema_types.json', JSON.stringify(data, null, 2));
}
run();
