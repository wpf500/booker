const baseUrl = 'http://localhost:3000/api';

export async function fetchApi(url: string, body?): Promise<any> {
  const resp = await fetch(baseUrl + url, {
    method: body === undefined ? 'GET' : 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  return await resp.json();
}
