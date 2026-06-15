(function() {
  // Configuração e exibição da data atual no cabeçalho
  function updateDateHeader() {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const today = new Date();
    let dateString = today.toLocaleDateString('pt-BR', options);
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    
    const el = document.getElementById('current-date');
    if (el) el.textContent = dateString;
  }

  // Atualizar o título do dia selecionado
  function updateSelectedDateTitle() {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const d = new Date(window.AppDB.activeDate + 'T12:00:00');
    let dateString = d.toLocaleDateString('pt-BR', options);
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    
    const el = document.getElementById('selected-date-title');
    if (el) el.textContent = `Agenda de: ${dateString}`;
  }

  // Atualizar a barra de progresso no cabeçalho
  function updateProgressBar() {
    const total = window.AppDB.tasks.length;
    const completed = window.AppDB.tasks.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const percentEl = document.getElementById('progress-percent');
    const barEl = document.getElementById('progress-bar');
    
    if (percentEl) percentEl.textContent = `${percentage}%`;
    if (barEl) barEl.style.width = `${percentage}%`;
  }

  // Renderizador da agenda diária
  function renderAgenda() {
    const lists = {
      manha: document.getElementById('manha-list'),
      tarde: document.getElementById('tarde-list'),
      noite: document.getElementById('noite-list'),
      inbox: document.getElementById('inbox-list')
    };

    Object.values(lists).forEach(el => { if (el) el.innerHTML = ''; });
    
    // Auto-inicializar rotina padrão para o dia ativo se vazio
    window.AppDB.ensureDateInitialized(window.AppDB.activeDate);

    // Filtrar tarefas da data ativa
    const activeTasks = window.AppDB.tasks.filter(t => t.date === window.AppDB.activeDate);

    const grouped = { manha: [], tarde: [], noite: [], inbox: [] };
    activeTasks.forEach(task => {
      if (grouped[task.period]) grouped[task.period].push(task);
      else grouped.inbox.push(task);
    });

    Object.keys(lists).forEach(period => {
      const listEl = lists[period];
      if (!listEl) return;

      const periodTasks = grouped[period];

      if (periodTasks.length === 0) {
        listEl.innerHTML = `<div class="empty-placeholder">Nenhuma demanda agendada</div>`;
        return;
      }

      // Ordenar: Alertas em primeiro, depois pendentes
      periodTasks.sort((a, b) => {
        if (a.isAlert !== b.isAlert) return a.isAlert ? -1 : 1;
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.createdAt - b.createdAt;
      });

      periodTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `task-item ${task.completed ? 'completed' : ''} ${task.isAlert ? 'alert-item' : ''} ${task.isRestDay ? 'rest-item' : ''}`;
        item.dataset.id = task.id;

        // Tags
        let tagsHTML = '';
        if (task.isRestDay) {
          tagsHTML += `<span class="tag-badge tag-rest">🛋️ Folga</span>`;
        } else if (task.isAlert) {
          tagsHTML += `<span class="tag-badge tag-alert">⚠️ IMPORTANTE</span>`;
        } else {
          const cleanText = task.text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if (cleanText.includes('hotel') || cleanText.includes('hoteis')) {
            tagsHTML += `<span class="tag-badge tag-hotel">🏨 Hotel</span>`;
          }
          if (cleanText.includes('chefe') || cleanText.includes('pagamento') || cleanText.includes('boleto')) {
            tagsHTML += `<span class="tag-badge tag-finance">💳 Financeiro</span>`;
          }
        }

        item.innerHTML = `
          <button class="task-checkbox-btn ${task.completed ? 'checked' : ''}" aria-label="Concluir tarefa">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <div class="task-content">
            <div class="task-text">
              ${escapeHTML(task.text)}
              ${tagsHTML}
            </div>
            <div class="task-actions">
              <select class="period-move-select" aria-label="Mover período">
                <option value="manha" ${task.period === 'manha' ? 'selected' : ''}>🌅 Manhã</option>
                <option value="tarde" ${task.period === 'tarde' ? 'selected' : ''}>☀️ Tarde</option>
                <option value="noite" ${task.period === 'noite' ? 'selected' : ''}>🌆 Noite</option>
                <option value="inbox" ${task.period === 'inbox' ? 'selected' : ''}>📥 Inbox</option>
              </select>
              <button class="btn-delete-task" title="Excluir tarefa" aria-label="Excluir tarefa">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        `;

        // Manipuladores locais
        item.querySelector('.task-checkbox-btn').addEventListener('click', () => {
          window.AppDB.toggleTask(task.id);
          renderAgenda();
        });

        item.querySelector('.period-move-select').addEventListener('change', (e) => {
          window.AppDB.moveTask(task.id, e.target.value);
          renderAgenda();
        });

        item.querySelector('.btn-delete-task').addEventListener('click', () => {
          window.AppDB.deleteTask(task.id, () => {
            renderAgenda();
          });
        });

        listEl.appendChild(item);
      });
    });

    updateProgressBar();
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Setup de eventos das abas
  function setupTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.AppMain.switchTab(btn.dataset.tab);
      });
    });
  }

  // Navegador de Data
  function setupDateNavigator() {
    document.getElementById('btn-prev-day').addEventListener('click', () => {
      const d = new Date(window.AppDB.activeDate + 'T12:00:00');
      d.setDate(d.getDate() - 1);
      window.AppDB.activeDate = window.AppDB.formatDateStr(d);
      document.getElementById('agenda-date-picker').value = window.AppDB.activeDate;
      renderAgenda();
    });

    document.getElementById('btn-next-day').addEventListener('click', () => {
      const d = new Date(window.AppDB.activeDate + 'T12:00:00');
      d.setDate(d.getDate() + 1);
      window.AppDB.activeDate = window.AppDB.formatDateStr(d);
      document.getElementById('agenda-date-picker').value = window.AppDB.activeDate;
      renderAgenda();
    });

    document.getElementById('btn-today').addEventListener('click', () => {
      window.AppDB.activeDate = window.AppDB.formatDateStr(new Date());
      document.getElementById('agenda-date-picker').value = window.AppDB.activeDate;
      renderAgenda();
    });
  }

  // Namespace Global de Controle Principal
  window.AppMain = {
    switchTab: function(tabId) {
      document.querySelectorAll('.nav-btn').forEach(b => {
        if (b.dataset.tab === tabId) b.classList.add('active');
        else b.classList.remove('active');
      });

      const contents = ['agenda', 'goals', 'analytics'];
      contents.forEach(id => {
        const el = document.getElementById(`tab-content-${id}`);
        if (el) {
          if (id === tabId) el.style.display = 'block';
          else el.style.display = 'none';
        }
      });

      if (tabId === 'agenda') {
        renderAgenda();
        updateSelectedDateTitle();
      }
      else if (tabId === 'goals') window.AppGoals.render();
      else if (tabId === 'analytics') window.AppAnalytics.render();
    }
  };

  // Inicialização geral
  document.addEventListener('DOMContentLoaded', () => {
    window.AppDB.init();
    updateDateHeader();
    updateSelectedDateTitle();
    setupTabs();
    setupDateNavigator();
    
    // Configurar picker de data padrão
    const picker = document.getElementById('agenda-date-picker');
    if (picker) picker.value = window.AppDB.activeDate;

    // Submissão de novas tarefas
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('task-input');
        const periodSelect = document.getElementById('task-period');

        if (input && periodSelect && input.value.trim()) {
          window.AppDB.addTask(input.value, periodSelect.value);
          input.value = '';
          input.focus();
          renderAgenda();
        }
      });
    }

    // Submissão de novas metas
    const goalForm = document.getElementById('goal-form');
    if (goalForm) {
      goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('goal-input');
        const statusSelect = document.getElementById('goal-status');

        if (input && statusSelect && input.value.trim()) {
          window.AppDB.addGoal(input.value, statusSelect.value);
          input.value = '';
          input.focus();
          window.AppGoals.render();
        }
      });
    }

    // Renderização inicial
    renderAgenda();
  });
})();
