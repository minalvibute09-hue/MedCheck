const TOKEN_KEY = 'medcheck.accessToken';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`/api${path}`, { ...options, headers });
  } catch {
    throw new Error('Cannot reach the MedCheck API. Start the API server and try again.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) clearAccessToken();
    const error = new Error(result.error || `The request failed (${response.status}).`);
    error.status = response.status;
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('medcheck:unauthorized'));
    }
    throw error;
  }
  return result;
}

export function registerAccount(details) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(details)
  });
}

export function loginAccount(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function getCurrentUser(token) {
  return request('/auth/me', { token });
}

export function getMedicalRecords(token) {
  return request('/records', { token });
}

export function saveMedicalRecord(token, record) {
  return request('/records', {
    method: 'POST',
    token,
    body: JSON.stringify({ record })
  });
}

export function extractMedicalDocument(token, document) {
  return request('/records/extract', {
    method: 'POST',
    token,
    body: JSON.stringify(document)
  });
}

export function getChatHistory(token, conversationId) {
  const params = new URLSearchParams({ conversationId });
  return request(`/chat/history?${params}`, { token });
}
