(function() {
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

  window.AppGoals = {
    render: function() {
      const cols = {
        todo: document.getElementById('goal-list-todo'),
        in_progress: document.getElementById('goal-list-in-progress'),
        done: document.getElementById('goal-list-done')
      };

      // Limpar colunas
      Object.values(cols).forEach(el => { if (el) el.innerHTML = ''; });

      const grouped = { todo: [], in_progress: [], done: [] };
      window.AppDB.goals.forEach(g => {
        if (grouped[g.status]) grouped[g.status].push(g);
        else grouped.todo.push(g);
      });

      Object.keys(cols).forEach(status => {
        const listEl = cols[status];
        if (!listEl) return;

        const statusGoals = grouped[status];
        if (statusGoals.length === 0) {
          listEl.innerHTML = `<div class="empty-placeholder">Nenhuma meta ativa</div>`;
          return;
        }

        // Ordenar por criação
        statusGoals.sort((a, b) => a.createdAt - b.createdAt);

        statusGoals.forEach(goal => {
          const item = document.createElement('div');
          item.className = 'goal-item';

          let actionsHTML = '';
          if (status === 'todo') {
            actionsHTML += `<button class="btn-move-goal" data-action="start" data-id="${goal.id}">⚡ Iniciar</button>`;
          } else if (status === 'in_progress') {
            actionsHTML += `
              <button class="btn-move-goal" data-action="revert" data-id="${goal.id}">📋 Devolver</button>
              <button class="btn-move-goal" data-action="complete" data-id="${goal.id}" style="color: #34d399;">✅ Concluir</button>
            `;
          } else if (status === 'done') {
            actionsHTML += `<button class="btn-move-goal" data-action="reopen" data-id="${goal.id}">⚡ Reabrir</button>`;
          }

          item.innerHTML = `
            <span class="goal-item-text">${escapeHTML(goal.text)}</span>
            <div class="goal-item-actions">
              <div style="display:flex; gap: 0.35rem;">${actionsHTML}</div>
              <button class="btn-delete-goal" data-id="${goal.id}" title="Excluir meta">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          `;

          // Eventos locais de movimentação
          item.querySelectorAll('.btn-move-goal').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const action = btn.dataset.action;
              let nextStatus = 'todo';
              if (action === 'start' || action === 'reopen') nextStatus = 'in_progress';
              else if (action === 'complete') nextStatus = 'done';
              
              window.AppDB.moveGoal(goal.id, nextStatus);
              window.AppGoals.render();
            });
          });

          // Evento local de deleção
          item.querySelector('.btn-delete-goal').addEventListener('click', () => {
            window.AppDB.deleteGoal(goal.id);
            window.AppGoals.render();
          });

          listEl.appendChild(item);
        });
      });
    }
  };
})();
