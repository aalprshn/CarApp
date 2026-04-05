const API = import.meta.env.VITE_API_URL || "https://carapp-epow.onrender.com";

export async function fetchOptions() {
  const res = await fetch(`${API}/options`);
  return res.json();
}

export async function searchCars(filters = {}, limit = 24, offset = 0) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== "") params.set(k, v); });
  params.set("limit", limit);
  params.set("offset", offset);
  const res = await fetch(`${API}/search?${params}`);
  return res.json();
}

export async function chatSearch(message) {
  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
}

export async function getCar(id) {
  const res = await fetch(`${API}/car/${id}`);
  return res.json();
}

export async function getListing(id) {
  const res = await fetch(`${API}/listing/${id}`);
  return res.json();
}
