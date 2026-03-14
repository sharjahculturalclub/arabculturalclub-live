import urllib.request
import json

url = 'https://shjarabclub.ae/graphql'
query = """
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
"""

req = urllib.request.Request(url, method='POST')
req.add_header('Content-Type', 'application/json')
data = json.dumps({'query': query}).encode('utf-8')

try:
    with urllib.request.urlopen(req, data=data) as response:
        print(response.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
