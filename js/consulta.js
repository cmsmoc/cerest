/**
 * consulta.js
 * Lógica da página de consulta por protocolo
 */

// Permite pressionar Enter no campo
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('protocolo-input');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') buscarProtocolo();
    });
    // Auto-uppercase
    input.addEventListener('input', e => {
      e.target.value = e.target.value.toUpperCase();
    });
    // Pré-preencher se vier via querystring
    const params = new URLSearchParams(window.location.search);
    if (params.get('protocolo')) {
      input.value = params.get('protocolo');
      buscarProtocolo();
    }
  }
});

async function buscarProtocolo() {
  const protocolo = document.getElementById('protocolo-input').value.trim().toUpperCase();
  if (!protocolo) return;

  // UI state
  document.getElementById('resultado').classList.add('hidden');
  document.getElementById('not-found').classList.add('hidden');
  document.getElementById('loading-search').classList.remove('hidden');

  try {
    const result = await apiGet({ action: 'consultar', protocolo });

    document.getElementById('loading-search').classList.add('hidden');

    if (result.found && result.data) {
      renderResultado(result.data);
    } else {
      document.getElementById('not-found').classList.remove('hidden');
    }
  } catch (err) {
    document.getElementById('loading-search').classList.add('hidden');
    document.getElementById('not-found').classList.remove('hidden');
    console.error(err);
  }
}

function renderResultado(d) {
  const el = document.getElementById('resultado');

  const statusBadge = getStatusBadge(d.status);
  const dataAgend = d.data_agendamento
    ? `<div class="result-agend">
        📅 <strong>Agendamento: ${formatDateBR(d.data_agendamento)}</strong>
        <p style="font-size:13px;color:var(--gray-600);margin-top:4px;">Compareça ao CEREST Montes Claros no horário indicado.</p>
       </div>`
    : '';

  el.innerHTML = `
    <div class="result-protocol">${d.protocolo}</div>
    ${statusBadge}
    <div class="result-grid" style="margin-top:16px;">
      <div class="result-item"><span class="label">Nome</span><span class="value">${d.nome || '—'}</span></div>
      <div class="result-item"><span class="label">Tipo de Agravo</span><span class="value">${d.tipo_agravo_label || d.tipo_agravo || '—'}</span></div>
      <div class="result-item"><span class="label">Data da Solicitação</span><span class="value">${formatDateBR(d.data_solicitacao)}</span></div>
      <div class="result-item"><span class="label">Urgente</span><span class="value">${d.urgente === 'SIM' ? '🚨 Sim' : 'Não'}</span></div>
    </div>
    ${dataAgend}
    ${d.observacoes ? `<div style="margin-top:14px;padding:12px 14px;background:var(--gray-50);border-radius:var(--radius-sm);font-size:14px;color:var(--gray-700);">
      <strong>Observação da equipe:</strong> ${d.observacoes}
    </div>` : ''}
  `;

  el.classList.remove('hidden');
}

function getStatusBadge(status) {
  const map = {
    'PENDENTE': 'badge-pendente',
    'EM ANÁLISE': 'badge-analisado',
    'AGENDADO': 'badge-agendado',
    'CONCLUÍDO': 'badge-concluido',
  };
  const cls = map[status] || 'badge-analisado';
  return `<span class="badge ${cls}" style="font-size:14px;padding:6px 16px;">${status || 'PENDENTE'}</span>`;
}
