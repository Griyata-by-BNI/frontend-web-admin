import { SubmissionDetail } from "../types";

const API_BASE_URL = "/api/v1/kpr";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = "YOUR_AUTH_TOKEN";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
}

export async function getAllSubmissions(
  statuses: string[]
): Promise<SubmissionDetail[]> {
  const promises = statuses.map((status) =>
    fetchAPI(`/submission?status=${status}`)
  );

  const results = await Promise.all(promises);

  return results.flatMap((result) => result.data.submissions);
}

export async function getSubmissionById(id: string): Promise<SubmissionDetail> {
  const result = await fetchAPI(`/submission/${id}`);
  return result.data;
}
