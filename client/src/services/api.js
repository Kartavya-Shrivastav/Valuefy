const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchRebalance(clientId) {
  const res = await fetch(`${BASE}/rebalance/${clientId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function saveRebalance(clientId) {
  const res = await fetch(`${BASE}/rebalance/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json;
}

export async function fetchHistory(clientId) {
  const res = await fetch(`${BASE}/history/${clientId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function fetchClients() {
  const res = await fetch(`${BASE}/clients`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function updateSessionStatus(sessionId, status) {
  const res = await fetch(`${BASE}/history/${sessionId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}