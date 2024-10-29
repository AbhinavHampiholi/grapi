// src/utils/api.ts

const GREPTILE_API_KEY = process.env.NEXT_PUBLIC_GREPTILE_API_KEY;
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export const generateCurlCommand = (request: RequestConfig): string => {
  const parts = [`curl -X ${request.method} '${request.url}'`];
  
  parts.push(`  -H 'Authorization: Bearer ${GREPTILE_API_KEY}'`);
  parts.push(`  -H 'X-Github-Token: ${GITHUB_TOKEN}'`);
  parts.push(`  -H 'Content-Type: application/json'`);
  
  if (request.method !== 'GET' && request.body) {
    parts.push(`  -d '${JSON.stringify(request.body)}'`);
  }
  
  return parts.join(' \\\n');
};

export const defaultRequests: Record<string, RequestConfig> = {
  'Submit Repository': {
    method: 'POST',
    url: 'https://api.greptile.com/v2/repositories',
    body: {
      remote: "github",
      repository: "AbhinavHampiholi/gramphibian",
      branch: "main"
    }
  },
  'Check Index Status': {
    method: 'GET',
    url: 'https://api.greptile.com/v2/repositories/github:main:AbhinavHampiholi/gramphibian',
    body: null
  },
  'Query Repository': {
    method: 'POST',
    url: 'https://api.greptile.com/v2/query',
    body: {
      messages: [{
        content: "Explain the code that generates the changelog",
        role: "user"
      }],
      repositories: [{
        remote: "github",
        repository: "AbhinavHampiholi/gramphibian",
        branch: "main"
      }],
      genius: true
    }
  }
};

export const sendRequest = async (requestContent: string) => {
  const request = JSON.parse(requestContent);
  
  let url = request.url;
  if (request.url.includes('/repositories/github:')) {
    const parts = url.split('/repositories/');
    url = `${parts[0]}/repositories/${encodeURIComponent(parts[1])}`;
  }

  const res = await fetch(url, {
    method: request.method,
    headers: {
      'Authorization': `Bearer ${GREPTILE_API_KEY}`,
      'X-Github-Token': GITHUB_TOKEN,
      'Content-Type': 'application/json'
    },
    body: request.method !== 'GET' ? JSON.stringify(request.body) : null,
  });
  
  return res.json();
};

export const areKeysPresent = () => {
  return Boolean(GREPTILE_API_KEY && GITHUB_TOKEN);
};