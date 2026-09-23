// O domínio da API NÃO fica mais fixo aqui — ele vem do config.js,
// que busca de um endpoint remoto. Assim você troca/adiciona domínio
// pelo seu painel, sem precisar recompilar o app.
import { getApiBaseUrl } from './config';

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

async function request(path, options = {}) {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Erro ${res.status}`);
  }

  return res.json();
}

// POST /login  { username, password } -> { token, user }
export async function login(username, password) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setAuthToken(data.token);
  return data;
}

// GET /catalog?type=music|clip&category=... -> { items: [...] }
export async function getCatalog(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/catalog${query ? `?${query}` : ''}`);
}

// GET /catalog/featured -> destaque pra tela inicial, escolhido pelo
// item mais ouvido no momento (seu servidor deve ordenar por playCount)
export async function getFeatured() {
  return request('/catalog/featured');
}

// GET /catalog/trending -> seção "Em alta" (mais ouvidos, lista)
export async function getTrending() {
  return request('/catalog/trending');
}

// GET /playlists -> blocos de playlists (Mais Ouvidas, Sertanejo, Funk, Pop...)
export async function getPlaylists() {
  return request('/playlists');
}

// GET /categories -> Todos, Nacional, Internacional...
export async function getCategories() {
  return request('/categories');
}

// A URL do arquivo (mp3/mp4) normalmente já vem pronta dentro de cada
// item do catálogo (ex: item.streamUrl), servida pelo seu Express com
// suporte a range requests para permitir seek.
export function streamUrl(itemId) {
  return `${getApiBaseUrl()}/stream/${itemId}`;
}
