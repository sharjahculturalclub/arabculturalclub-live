const fetch = require('node-fetch');

async function run() {
  const query = `
    query {
      page(id: "swimming-subscription", idType: URI) {
        id
        pageId
        title
        slug
        template {
          templateName
        }
      }
    }
  `;
  const res = await fetch('https://shjarabclub.ae/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  console.log(await res.json());
}
run();
