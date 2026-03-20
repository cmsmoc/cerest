/**
 * painel.js
 * Lógica do painel interno CEREST
 * Protegido por: autenticação Google via GAS doGet
 */

let allData = [];
let filteredData = [];
let currentPage = 1;
const ROWS_PER_PAGE = 20;
let currentEditId = null;

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  loadData();
  showSection('dashboard');
});

// ====== SEÇÕES ======
function showSection(name) {
  document.querySelectorAll('.painel-section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`section-${name}`).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[onclick*="${name}"]`)?.classList.add('active');
  document.getElementById('page-title').textContent = {
    dashboard: 'Dashboard',
    solicitacoes: 'Solicitações',
    agendamentos: 'Agendamentos',
    configuracoes: 'Configurações',
  }[name] || name;
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ====== LOAD USER INFO ======
async function loadUserInfo() {
  try {
    const result = await apiGet({ action: 'userInfo' });
    if (result.name) {
      document.getElementById('user-name').textContent = result.name;
      document.getElementById('user-avatar').textContent = result.name.charAt(0).toUpperCase();
    }
  } catch (e) {
    document.getElementById('user-name').textContent = 'Equipe CEREST';
  }
}

// ====== LOAD DATA ======
async function loadData() {
  try {
    const result = await apiGet({ action: 'listar' });
    allData = result.data || [];
    filteredData = [...allData];
    
    renderDashboard();
    renderTable();
    renderAgendamentos();
    checkAlerts();
    populateFilters();
    loadConfigs();
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    showToast('Erro ao carregar dados. Verifique a conexão.', 'error');
  }
}

// ====== DASHBOARD ======
function renderDashboard() {
  const counts = { PENDENTE: 0, 'EM ANÁLISE': 0, AGENDADO: 0, 'CONCLUÍDO': 0 };
  allData.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });
  
  document.getElementById('count-pendente').textContent = counts['PENDENTE'];
  document.getElementById('count-analise').textContent = counts['EM ANÁLISE'];
  document.getElementById('count-agendado').textContent = counts['AGENDADO'];
  document.getElementById('count-concluido').textContent = counts['CONCLUÍDO'];

  // Recentes (últimas 10)
  const recent = [...allData].slice(0, 10);
  renderTableBody('recent-tbody', recent, true);
}

// ====== ALERTS ======
function checkAlerts() {
  const alertDays = parseInt(localStorage.getItem('cerest_alertDays') || '3');
  const now = new Date();
  const pendentes = allData.filter(r => {
    if (r.status !== 'PENDENTE') return false;
    const dataSolic = new Date(r.data_solicitacao);
    const diff = (now - dataSolic) / (1000 * 60 * 60 * 24);
    return diff >= alertDays;
  });
  
  const badge = document.getElementById('alert-badge');
  const count = document.getElementById('alert-count');
  if (pendentes.length > 0) {
    count.textContent = pendentes.length;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// ====== TABLE ======
function renderTable() {
  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const page = filteredData.slice(start, start + ROWS_PER_PAGE);
  renderTableBody('main-tbody', page, false);
  renderPagination();
}

function renderTableBody(tbodyId, rows, compact) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="${compact ? 6 : 9}" class="loading-cell">Nenhum registro encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(r => {
    const statusBadge = getStatusBadge(r.status);
    const urgenteBadge = r.urgente === 'SIM' ? '<span class="badge badge-urgente">🚨 URGENTE</span>' : '—';
    
    if (compact) {
      return `<tr>
        <td><code style="font-family:var(--font-mono);font-size:12px;">${r.protocolo || ''}</code></td>
        <td>${r.nome || ''}</td>
        <td>${r.tipo_agravo_label || r.tipo_agravo || ''}</td>
        <td>${formatDateBR(r.data_solicitacao)}</td>
        <td>${statusBadge}</td>
        <td><button class="table-action-btn" onclick="openModal('${r.id}')">📝 Editar</button></td>
      </tr>`;
    }

    return `<tr>
      <td><code style="font-family:var(--font-mono);font-size:12px;">${r.protocolo || ''}</code></td>
      <td>${r.nome || ''}</td>
      <td><small>${r.cpf || ''}</small></td>
      <td>${r.tipo_agravo_label || r.tipo_agravo || ''}</td>
      <td>${formatDateBR(r.data_solicitacao)}</td>
      <td>${urgenteBadge}</td>
      <td>${statusBadge}</td>
      <td>${r.data_agendamento ? formatDateBR(r.data_agendamento) : '—'}</td>
      <td>
        <button class="table-action-btn" onclick="openModal('${r.id}')">📝 Ver/Editar</button>
        ${r.link_documento ? `<a href="${r.link_documento}" target="_blank"><button class="table-action-btn">📄 Doc</button></a>` : ''}
      </td>
    </tr>`;
  }).join('');
}

function getStatusBadge(status) {
  const map = {
    'PENDENTE': 'badge-pendente',
    'EM ANÁLISE': 'badge-analisado',
    'AGENDADO': 'badge-agendado',
    'CONCLUÍDO': 'badge-concluido',
  };
  return `<span class="badge ${map[status] || 'badge-analisado'}">${status || 'PENDENTE'}</span>`;
}

// ====== PAGINATION ======
function renderPagination() {
  const total = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const pag = document.getElementById('pagination');
  if (!pag || total <= 1) { if (pag) pag.innerHTML = ''; return; }

  let btns = '';
  for (let i = 1; i <= total; i++) {
    btns += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  pag.innerHTML = btns;
}

function goPage(n) {
  currentPage = n;
  renderTable();
}

// ====== FILTERS ======
function populateFilters() {
  const agravos = [...new Set(allData.map(r => r.tipo_agravo_label || r.tipo_agravo).filter(Boolean))];
  const sel = document.getElementById('filter-agravo');
  if (sel) {
    sel.innerHTML = '<option value="">Todos os agravos</option>' +
      agravos.map(a => `<option value="${a}">${a}</option>`).join('');
  }
}

function filterTable() {
  const search = (document.getElementById('search-input')?.value || '').toLowerCase();
  const status = document.getElementById('filter-status')?.value || '';
  const agravo = document.getElementById('filter-agravo')?.value || '';
  const urgente = document.getElementById('filter-urgente')?.value || '';

  filteredData = allData.filter(r => {
    const matchSearch = !search || 
      (r.protocolo || '').toLowerCase().includes(search) ||
      (r.nome || '').toLowerCase().includes(search) ||
      (r.cpf || '').replace(/\D/g,'').includes(search.replace(/\D/g,''));
    const matchStatus = !status || r.status === status;
    const matchAgravo = !agravo || (r.tipo_agravo_label || r.tipo_agravo) === agravo;
    const matchUrgente = !urgente || r.urgente === urgente;
    return matchSearch && matchStatus && matchAgravo && matchUrgente;
  });

  currentPage = 1;
  renderTable();
}

// ====== AGENDAMENTOS ======
function renderAgendamentos() {
  const agendados = allData
    .filter(r => r.data_agendamento)
    .sort((a, b) => new Date(a.data_agendamento) - new Date(b.data_agendamento));

  const tbody = document.getElementById('agend-tbody');
  if (!tbody) return;

  if (!agendados.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">Nenhum agendamento registrado.</td></tr>';
    return;
  }

  tbody.innerHTML = agendados.map(r => `
    <tr>
      <td><strong>${formatDateBR(r.data_agendamento)}</strong></td>
      <td><code style="font-family:var(--font-mono);font-size:12px;">${r.protocolo}</code></td>
      <td>${r.nome || ''}</td>
      <td>${r.tipo_agravo_label || r.tipo_agravo || ''}</td>
      <td>${r.contato || ''}</td>
      <td>${getStatusBadge(r.status)}</td>
    </tr>
  `).join('');
}

// ====== MODAL ======
function openModal(id) {
  const record = allData.find(r => r.id == id);
  if (!record) return;
  currentEditId = id;

  document.getElementById('modal-title').textContent = `Protocolo: ${record.protocolo}`;
  
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-info-grid">
      <div class="modal-info-item"><div class="label">Nome</div><div class="value">${record.nome || ''}</div></div>
      <div class="modal-info-item"><div class="label">CPF</div><div class="value">${record.cpf || ''}</div></div>
      <div class="modal-info-item"><div class="label">Contato</div><div class="value">${record.contato || ''}</div></div>
      <div class="modal-info-item"><div class="label">Agravo</div><div class="value">${record.tipo_agravo_label || record.tipo_agravo || ''}</div></div>
      <div class="modal-info-item"><div class="label">Data Solicitação</div><div class="value">${formatDateBR(record.data_solicitacao)}</div></div>
      <div class="modal-info-item"><div class="label">Urgente</div><div class="value">${record.urgente === 'SIM' ? '🚨 SIM' : 'Não'}</div></div>
    </div>
    
    ${record.descricao_ocorrencia ? `
    <div style="background:var(--gray-50);padding:12px;border-radius:6px;margin-bottom:16px;font-size:14px;">
      <strong>Descrição:</strong> ${record.descricao_ocorrencia}
    </div>` : ''}

    <div class="modal-field-group">
      <div class="modal-field">
        <label for="modal-status">Status</label>
        <select id="modal-status">
          <option value="PENDENTE" ${record.status === 'PENDENTE' ? 'selected' : ''}>PENDENTE</option>
          <option value="EM ANÁLISE" ${record.status === 'EM ANÁLISE' ? 'selected' : ''}>EM ANÁLISE</option>
          <option value="AGENDADO" ${record.status === 'AGENDADO' ? 'selected' : ''}>AGENDADO</option>
          <option value="CONCLUÍDO" ${record.status === 'CONCLUÍDO' ? 'selected' : ''}>CONCLUÍDO</option>
        </select>
      </div>
      <div class="modal-field">
        <label for="modal-data-agend">Data de Agendamento</label>
        <input type="date" id="modal-data-agend" value="${record.data_agendamento || ''}" 
          onchange="if(this.value) document.getElementById('modal-status').value='AGENDADO'" />
        <small style="color:var(--gray-400);font-size:12px;">Ao inserir a data, o status muda automaticamente para AGENDADO</small>
      </div>
      <div class="modal-field">
        <label for="modal-obs">Observações da Equipe</label>
        <textarea id="modal-obs" rows="3">${record.observacoes || ''}</textarea>
      </div>
      ${record.link_documento ? `
      <div class="modal-field">
        <label>Documento Gerado</label>
        <a href="${record.link_documento}" target="_blank" class="btn-sm" style="display:inline-block;width:fit-content;">📄 Abrir Documento</a>
      </div>` : ''}
    </div>
  `;

  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  currentEditId = null;
}

async function saveModalData() {
  if (!currentEditId) return;

  const status = document.getElementById('modal-status').value;
  const dataAgend = document.getElementById('modal-data-agend').value;
  const obs = document.getElementById('modal-obs').value;

  try {
    const result = await apiPost({
      action: 'atualizar',
      id: currentEditId,
      status,
      data_agendamento: dataAgend,
      observacoes: obs,
    });

    if (result.success) {
      showToast('Dados salvos com sucesso!', 'success');
      closeModal();
      loadData();
    } else {
      showToast('Erro ao salvar: ' + (result.message || ''), 'error');
    }
  } catch (err) {
    showToast('Erro de conexão.', 'error');
  }
}

// ====== CONFIGS ======
async function loadConfigs() {
  try {
    const result = await apiGet({ action: 'getConfig' });
    if (result.config) {
      if (document.getElementById('cfg-folder-id'))
        document.getElementById('cfg-folder-id').value = result.config.folderId || '';
      if (document.getElementById('cfg-email-cerest'))
        document.getElementById('cfg-email-cerest').value = result.config.emailCerest || '';
      if (document.getElementById('cfg-alert-days'))
        document.getElementById('cfg-alert-days').value = result.config.alertDays || '3';
    }
  } catch (e) { /* silencioso */ }
}

async function saveConfig(key, value) {
  try {
    const result = await apiPost({ action: 'saveConfig', key, value });
    if (result.success) {
      showToast(`Configuração "${key}" salva!`, 'success');
    }
  } catch (e) {
    showToast('Erro ao salvar configuração.', 'error');
  }
}

async function runSetup() {
  if (!confirm('Isso irá criar/reconfigurar as abas da planilha. Continuar?')) return;
  try {
    const result = await apiPost({ action: 'setup' });
    if (result.success) {
      showToast('Setup concluído! Planilha configurada.', 'success');
    } else {
      showToast('Erro no setup: ' + (result.message || ''), 'error');
    }
  } catch (e) {
    showToast('Erro ao executar setup.', 'error');
  }
}
