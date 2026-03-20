/**
 * form.js
 * Lógica do formulário multi-etapa CEREST
 */

let currentStep = 1;
const TOTAL_STEPS = 4;

// ====== NAVEGAÇÃO ENTRE ETAPAS ======

function showStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.add('hidden'));
  const step = document.getElementById(`step-${n}`);
  if (step) step.classList.remove('hidden');

  // Atualiza indicadores de progresso
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const ind = document.getElementById(`step-ind-${i}`);
    if (!ind) continue;
    ind.classList.remove('active', 'completed');
    if (i === n) ind.classList.add('active');
    else if (i < n) ind.classList.add('completed');
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentStep = n;
}

function nextStep(from) {
  if (!validateStep(from)) return;
  
  if (from === TOTAL_STEPS - 1) {
    buildReview();
  }
  
  showStep(from + 1);
}

function prevStep(from) {
  showStep(from - 1);
}

// ====== VALIDAÇÃO POR ETAPA ======

function validateStep(n) {
  let valid = true;

  if (n === 1) {
    valid = validateFields(['nome', 'cpf', 'data_nascimento', 'sexo', 'telefone', 'email_solicitante', 'municipio']);
    if (valid && !validarCPF(document.getElementById('cpf').value)) {
      showFieldError('cpf', 'CPF inválido');
      valid = false;
    }
  }

  if (n === 2) {
    const tipoAgravo = document.getElementById('tipo_agravo').value;
    if (!tipoAgravo) {
      document.getElementById('agravo-error').textContent = 'Selecione um tipo de agravo';
      valid = false;
    }
    if (!validateFields(['descricao_ocorrencia'])) valid = false;
  }

  if (n === 3) {
    // Valida campos required dinâmicos
    const required = document.querySelectorAll('#dynamic-fields [required]');
    required.forEach(el => {
      if (!el.value.trim()) {
        showFieldError(el.id, 'Campo obrigatório');
        valid = false;
      } else {
        clearFieldError(el.id);
      }
    });
  }

  if (n === 4) {
    if (!document.getElementById('aceite_lgpd').checked) {
      document.getElementById('lgpd-error').textContent = 'Você precisa aceitar os termos para continuar';
      valid = false;
    } else {
      document.getElementById('lgpd-error').textContent = '';
    }
  }

  return valid;
}

function validateFields(fieldIds) {
  let valid = true;
  fieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) {
      showFieldError(id, 'Campo obrigatório');
      valid = false;
    } else {
      clearFieldError(id);
    }
  });
  return valid;
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('error');
    const errEl = el.parentElement.querySelector('.field-error');
    if (errEl) errEl.textContent = msg;
  }
}

function clearFieldError(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('error');
    const errEl = el.parentElement.querySelector('.field-error');
    if (errEl) errEl.textContent = '';
  }
}

// ====== REVISÃO ======

function buildReview() {
  const rc = document.getElementById('review-content');
  if (!rc) return;

  const agravo = AGRAVOS.find(a => a.id === document.getElementById('tipo_agravo').value);

  rc.innerHTML = `
    <div class="review-section">
      <div class="review-section-title">Identificação</div>
      <div class="review-grid">
        ${reviewItem('Nome', getValue('nome'))}
        ${reviewItem('CPF', getValue('cpf'))}
        ${reviewItem('Nascimento', formatDateBR(getValue('data_nascimento')))}
        ${reviewItem('Sexo', getValue('sexo'))}
        ${reviewItem('Telefone', getValue('telefone'))}
        ${reviewItem('E-mail', getValue('email_solicitante'))}
        ${reviewItem('Município', getValue('municipio'))}
        ${reviewItem('Empresa', getValue('empresa') || '—')}
        ${reviewItem('Ocupação', getValue('ocupacao') || '—')}
      </div>
    </div>
    <div class="review-section">
      <div class="review-section-title">Tipo de Agravo</div>
      <div class="review-grid">
        ${reviewItem('Agravo', agravo ? `${agravo.icon} ${agravo.label}` : getValue('tipo_agravo'))}
        ${reviewItem('Urgente', document.getElementById('urgente').checked ? '🚨 SIM' : 'Não')}
        ${reviewItem('Data da Ocorrência', formatDateBR(getValue('data_ocorrencia')) || '—')}
        ${reviewItem('Local', getValue('local_ocorrencia') || '—')}
      </div>
      <div class="review-item" style="margin-top:12px">
        <span class="label">Descrição</span>
        <span class="value">${getValue('descricao_ocorrencia')}</span>
      </div>
    </div>
    ${agravo && agravo.campos.length ? `
    <div class="review-section">
      <div class="review-section-title">Dados Específicos</div>
      <div class="review-grid">
        ${agravo.campos.map(c => reviewItem(c.label, getValue(c.id) || '—')).join('')}
      </div>
    </div>
    ` : ''}
  `;
}

function reviewItem(label, value) {
  return `<div class="review-item"><span class="label">${label}</span><span class="value">${value}</span></div>`;
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

// ====== ENVIO DO FORMULÁRIO ======

async function submitForm() {
  if (!validateStep(4)) return;

  const btn = document.getElementById('submit-btn');
  document.getElementById('submit-text').style.display = 'none';
  document.getElementById('submit-loading').style.display = 'inline-flex';
  btn.disabled = true;

  // Coleta todos os dados do formulário
  const form = document.getElementById('main-form');
  const formData = new FormData(form);
  const data = { action: 'submit' };
  formData.forEach((v, k) => { data[k] = v; });

  // Inclui campos dinâmicos não no FormData (dinamicamente criados)
  const agravo = AGRAVOS.find(a => a.id === data.tipo_agravo);
  if (agravo) {
    agravo.campos.forEach(c => {
      const el = document.getElementById(c.id);
      if (el) data[c.id] = el.value;
    });
  }

  data.urgente = document.getElementById('urgente').checked ? 'SIM' : 'NÃO';
  data.terceiro = document.getElementById('terceiro').checked ? 'SIM' : 'NÃO';

  try {
    const result = await apiPost(data);
    
    if (result.success) {
      document.getElementById('main-form').classList.add('hidden');
      const successPanel = document.getElementById('success-panel');
      successPanel.classList.remove('hidden');
      document.getElementById('protocol-display').textContent = result.protocolo || '—';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Erro ao enviar: ' + (result.message || 'Tente novamente.'), 'error');
      btn.disabled = false;
      document.getElementById('submit-text').style.display = 'inline';
      document.getElementById('submit-loading').style.display = 'none';
    }
  } catch (err) {
    console.error(err);
    showToast('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
    btn.disabled = false;
    document.getElementById('submit-text').style.display = 'inline';
    document.getElementById('submit-loading').style.display = 'none';
  }
}

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
  showStep(1);
});
