/**
 * agravos.js
 * Definição dos 11 tipos de agravo e campos dinâmicos
 */

const AGRAVOS = [
  {
    id: 'CAT',
    label: 'CAT – Acidente de Trabalho',
    icon: '🦺',
    campos: [
      { id: 'cat_tipo', label: 'Tipo de Acidente', type: 'select', required: true,
        options: ['Típico (no trabalho)', 'Trajeto (no percurso)', 'Doença Ocupacional'] },
      { id: 'cat_parte_corpo', label: 'Parte do Corpo Atingida', type: 'text', placeholder: 'Ex: mão direita, coluna...' },
      { id: 'cat_natureza', label: 'Natureza da Lesão', type: 'select',
        options: ['Fratura', 'Contusão', 'Corte/Laceração', 'Queimadura', 'Entorse', 'Amputação', 'Intoxicação', 'Outro'] },
      { id: 'cat_houve_afastamento', label: 'Houve Afastamento?', type: 'select',
        options: ['Não', 'Sim – menos de 15 dias', 'Sim – mais de 15 dias'] },
      { id: 'cat_cid', label: 'CID (se disponível)', type: 'text', placeholder: 'Ex: S62.0' },
      { id: 'cat_cnpj', label: 'CNPJ da Empresa', type: 'text', placeholder: '00.000.000/0001-00' },
    ]
  },
  {
    id: 'DORT',
    label: 'DORT – Distúrbio Osteomuscular',
    icon: '🦴',
    campos: [
      { id: 'dort_regiao', label: 'Região Afetada', type: 'text', placeholder: 'Ex: ombro, punho, joelho...' },
      { id: 'dort_tempo_sintomas', label: 'Tempo de Sintomas', type: 'select',
        options: ['Menos de 1 mês', '1 a 6 meses', '6 meses a 1 ano', 'Mais de 1 ano'] },
      { id: 'dort_funcao', label: 'Função/Atividade Exercida', type: 'text', placeholder: 'Ex: digitação, montagem...' },
      { id: 'dort_ja_tratou', label: 'Já realizou tratamento?', type: 'select',
        options: ['Não', 'Sim – médico particular', 'Sim – UBS/SUS', 'Sim – plano de saúde'] },
      { id: 'dort_cid', label: 'CID (se disponível)', type: 'text', placeholder: 'Ex: M75.0' },
    ]
  },
  {
    id: 'INTOXICACAO',
    label: 'Intoxicação Exógena',
    icon: '☠️',
    campos: [
      { id: 'intox_agente', label: 'Agente Causador', type: 'text', required: true, placeholder: 'Ex: agrotóxico, solvente, medicamento...' },
      { id: 'intox_via', label: 'Via de Exposição', type: 'select',
        options: ['Inalação', 'Ingestão', 'Contato dérmico', 'Ocular', 'Múltiplas vias'] },
      { id: 'intox_circunstancia', label: 'Circunstância', type: 'select',
        options: ['Trabalho', 'Ambiental', 'Uso Terapêutico', 'Tentativa Suicídio', 'Acidente Individual', 'Outro'] },
      { id: 'intox_tempo_exposicao', label: 'Tempo de Exposição', type: 'text', placeholder: 'Ex: 2 horas, crônica...' },
      { id: 'intox_sintomas', label: 'Sintomas Relatados', type: 'textarea', placeholder: 'Descreva os sintomas...' },
    ]
  },
  {
    id: 'SILICOSE',
    label: 'Pneumoconiose / Silicose',
    icon: '🫁',
    campos: [
      { id: 'pneumo_tipo', label: 'Tipo de Pneumoconiose', type: 'select',
        options: ['Silicose', 'Asbestose', 'Antracose', 'Outra pneumoconiose'] },
      { id: 'pneumo_ocupacao', label: 'Ocupação de Risco', type: 'text', placeholder: 'Ex: mineiro, ceramista, pedreiro...' },
      { id: 'pneumo_tempo_exposicao', label: 'Tempo Total de Exposição', type: 'text', placeholder: 'Ex: 10 anos' },
      { id: 'pneumo_exames', label: 'Possui exames?', type: 'select',
        options: ['Não', 'Sim – Raio-X', 'Sim – TC de Tórax', 'Sim – Espirometria', 'Sim – vários exames'] },
    ]
  },
  {
    id: 'PERDA_AUDITIVA',
    label: 'PAIR – Perda Auditiva',
    icon: '👂',
    campos: [
      { id: 'pair_lado', label: 'Lado Afetado', type: 'select',
        options: ['Bilateral', 'Esquerdo', 'Direito'] },
      { id: 'pair_grau', label: 'Grau (se avaliado)', type: 'select',
        options: ['Não avaliado', 'Leve', 'Moderado', 'Severo', 'Profundo'] },
      { id: 'pair_tempo_ruido', label: 'Tempo de Exposição ao Ruído', type: 'text', placeholder: 'Ex: 8 anos' },
      { id: 'pair_uso_epi', label: 'Usava EPI Auricular?', type: 'select',
        options: ['Sempre', 'Às vezes', 'Raramente', 'Nunca'] },
      { id: 'pair_audiometria', label: 'Possui Audiometria?', type: 'select',
        options: ['Não', 'Sim – recente (< 1 ano)', 'Sim – antiga (> 1 ano)'] },
    ]
  },
  {
    id: 'CANCER_TRABALHO',
    label: 'Câncer Relacionado ao Trabalho',
    icon: '🔬',
    campos: [
      { id: 'cancer_tipo', label: 'Tipo de Câncer (CID)', type: 'text', required: true, placeholder: 'Ex: C34 – Pulmão' },
      { id: 'cancer_agente', label: 'Agente Carcinogênico Suspeito', type: 'text', placeholder: 'Ex: asbesto, benzeno, sílica...' },
      { id: 'cancer_fase', label: 'Fase do Diagnóstico', type: 'select',
        options: ['Suspeita', 'Confirmado – fase inicial', 'Confirmado – avançado', 'Em tratamento', 'Pós-tratamento'] },
      { id: 'cancer_tempo_exposicao', label: 'Tempo de Exposição ao Agente', type: 'text', placeholder: 'Ex: 15 anos' },
    ]
  },
  {
    id: 'MENTAL',
    label: 'Transtorno Mental Relacionado ao Trabalho',
    icon: '🧠',
    campos: [
      { id: 'mental_cid', label: 'Diagnóstico/CID', type: 'text', placeholder: 'Ex: F41 – Ansiedade' },
      { id: 'mental_fator', label: 'Fator de Trabalho Relacionado', type: 'select',
        options: ['Assédio moral', 'Sobrecarga de trabalho', 'Metas abusivas', 'Violência no trabalho',
                  'Trabalho noturno', 'Burnout', 'Outro'] },
      { id: 'mental_afastamento', label: 'Está afastado?', type: 'select',
        options: ['Não', 'Sim – benefício INSS', 'Sim – licença médica', 'Sim – afastamento próprio'] },
      { id: 'mental_acompanhamento', label: 'Faz acompanhamento?', type: 'select',
        options: ['Não', 'Sim – psicólogo', 'Sim – psiquiatra', 'Sim – ambos', 'Sim – outro profissional'] },
    ]
  },
  {
    id: 'DERMATOSE',
    label: 'Dermatose Ocupacional',
    icon: '🩹',
    campos: [
      { id: 'derma_tipo', label: 'Tipo de Lesão', type: 'select',
        options: ['Dermatite de contato', 'Urticária', 'Acne ocupacional', 'Melanodermia', 'Outro'] },
      { id: 'derma_local', label: 'Local da Lesão', type: 'text', placeholder: 'Ex: mãos, antebraços...' },
      { id: 'derma_agente', label: 'Agente Causador', type: 'text', placeholder: 'Ex: cimento, detergente, látex...' },
      { id: 'derma_tempo', label: 'Tempo de Sintomas', type: 'text', placeholder: 'Ex: 3 meses' },
    ]
  },
  {
    id: 'VIOLENCIA',
    label: 'Violência no Trabalho',
    icon: '⚠️',
    campos: [
      { id: 'viol_tipo', label: 'Tipo de Violência', type: 'select', required: true,
        options: ['Assédio moral', 'Assédio sexual', 'Violência física', 'Violência verbal', 'Discriminação', 'Outro'] },
      { id: 'viol_autor', label: 'Autor (vínculo)', type: 'select',
        options: ['Chefe/Supervisor', 'Colega de trabalho', 'Cliente/Paciente', 'Terceiro', 'Prefere não informar'] },
      { id: 'viol_tempo', label: 'Período das Ocorrências', type: 'text', placeholder: 'Ex: últimos 6 meses' },
      { id: 'viol_bo', label: 'Registrou Boletim de Ocorrência?', type: 'select',
        options: ['Não', 'Sim', 'Não sabe como fazer'] },
    ]
  },
  {
    id: 'AGROTÓXICO',
    label: 'Exposição a Agrotóxico',
    icon: '🌿',
    campos: [
      { id: 'agro_produto', label: 'Produto(s) Utilizado(s)', type: 'text', required: true, placeholder: 'Ex: Roundup, Glifosato...' },
      { id: 'agro_tipo_trabalho', label: 'Tipo de Trabalho', type: 'select',
        options: ['Aplicação direta', 'Mistura/Preparo', 'Colheita pós-aplicação', 'Moradia próxima à lavoura', 'Outro'] },
      { id: 'agro_epi', label: 'Utilizava EPI?', type: 'select',
        options: ['EPI completo', 'EPI parcial', 'Não utilizava', 'Não havia EPI disponível'] },
      { id: 'agro_sintomas', label: 'Sintomas Apresentados', type: 'textarea', placeholder: 'Descreva os sintomas...' },
      { id: 'agro_frequencia', label: 'Frequência de Exposição', type: 'select',
        options: ['Ocasional', 'Semanal', 'Diária', 'Contínua – anos'] },
    ]
  },
  {
    id: 'OUTRO',
    label: 'Outro / Informação Geral',
    icon: '📋',
    campos: [
      { id: 'outro_descricao', label: 'Descreva o motivo da solicitação', type: 'textarea', required: true,
        placeholder: 'Informe detalhadamente o motivo pelo qual está buscando o CEREST...' },
      { id: 'outro_referencia', label: 'Referência (quem indicou)', type: 'text', placeholder: 'Ex: UBS do Bairro X, médico Dr. ...' },
    ]
  },
];

// Renderiza o grid de agravos
function renderAgravoGrid() {
  const grid = document.getElementById('agravo-grid');
  if (!grid) return;
  grid.innerHTML = AGRAVOS.map(a => `
    <div class="agravo-card" data-id="${a.id}" onclick="selectAgravo('${a.id}')">
      <span class="agravo-icon">${a.icon}</span>
      <span>${a.label}</span>
    </div>
  `).join('');
}

// Seleciona um agravo
function selectAgravo(id) {
  document.querySelectorAll('.agravo-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.agravo-card[data-id="${id}"]`);
  if (card) card.classList.add('selected');
  const agravo = AGRAVOS.find(a => a.id === id);
  document.getElementById('tipo_agravo').value = id;
  document.getElementById('tipo_agravo_label').value = agravo ? agravo.label : id;
  document.getElementById('agravo-error').textContent = '';
  // Atualiza campos dinâmicos
  if (agravo) {
    document.getElementById('step3-subtitle').textContent = `Campos específicos para: ${agravo.label}`;
    renderDynamicFields(agravo);
  }
}

// Renderiza campos dinâmicos
function renderDynamicFields(agravo) {
  const container = document.getElementById('dynamic-fields');
  if (!container) return;
  container.innerHTML = '';

  if (!agravo || !agravo.campos.length) {
    container.innerHTML = '<p style="color:var(--gray-600);font-size:14px;">Nenhum campo específico para este agravo.</p>';
    return;
  }

  const title = document.createElement('div');
  title.className = 'dynamic-section-title';
  title.textContent = `Dados Específicos – ${agravo.label}`;
  container.appendChild(title);

  const row = document.createElement('div');
  row.className = 'field-group';

  agravo.campos.forEach(campo => {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field';
    
    let inputHTML = '';
    if (campo.type === 'select') {
      inputHTML = `<select id="${campo.id}" name="${campo.id}" ${campo.required ? 'required' : ''}>
        <option value="">Selecione...</option>
        ${campo.options.map(o => `<option value="${o}">${o}</option>`).join('')}
      </select>`;
    } else if (campo.type === 'textarea') {
      inputHTML = `<textarea id="${campo.id}" name="${campo.id}" rows="3" 
        placeholder="${campo.placeholder || ''}" ${campo.required ? 'required' : ''}></textarea>`;
    } else {
      inputHTML = `<input type="text" id="${campo.id}" name="${campo.id}" 
        placeholder="${campo.placeholder || ''}" ${campo.required ? 'required' : ''} />`;
    }

    fieldDiv.innerHTML = `
      <label for="${campo.id}">${campo.label}${campo.required ? ' <span class="req">*</span>' : ''}</label>
      ${inputHTML}
      <span class="field-error"></span>
    `;
    row.appendChild(fieldDiv);
  });

  container.appendChild(row);
}
