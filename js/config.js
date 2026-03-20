/**
 * config.js
 * Configurações globais do sistema CEREST
 * Altere apenas a GAS_URL após publicar o Web App
 */

const CEREST_CONFIG = {
  // URL do Google Apps Script publicado como Web App
  GAS_URL: 'https://script.google.com/macros/s/AKfycbzKUJ-G_9_c4YMHRO1Yqmg8ZWtsypgNaA_SHR8gxoPm12S-IFCdbgtPmuo17RCLQRvFKg/exec',
  
  // Versão do sistema
  VERSION: '1.0.0',
  
  // Nome da instituição
  INSTITUICAO: 'CEREST Montes Claros',
  
  // Timeout para requests (ms)
  REQUEST_TIMEOUT: 30000,
};

// Helper: faz GET para a API GAS
async function apiGet(params = {}) {
  const url = new URL(CEREST_CONFIG.GAS_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// Helper: faz POST para a API GAS
async function apiPost(data = {}) {
  const res = await fetch(CEREST_CONFIG.GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // GAS requer text/plain para evitar preflight
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// Helper: mostrar toast
function showToast(msg, type = 'default') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast ${type}`;
  t.classList.remove('hidden');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.add('hidden'), 4000);
}

// Helper: formatar data BR
function formatDateBR(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'));
  return d.toLocaleDateString('pt-BR');
}

// Helper: formatar data+hora BR
function formatDateTimeBR(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('pt-BR');
}
