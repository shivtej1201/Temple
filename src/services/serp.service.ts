import { getJson } from 'serpapi';

export async function searchWeb(query: string, location: string = "India") {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    throw new Error("SERPAPI_KEY is not defined in environment variables");
  }

  return new Promise((resolve, reject) => {
    getJson({
      q: query,
      location: location,
      hl: "hi",
      gl: "in",
      google_domain: "google.co.in",
      api_key: apiKey
    }, (json) => {
      if (json.error) {
        reject(new Error(json.error));
      } else {
        resolve(json);
      }
    });
  });
}
