(function() {
  function calculatePeakDay() {
    const completedTasks = window.AppDB.tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return "-";
    
    const counts = Array(7).fill(0);
    completedTasks.forEach(t => {
      const dObj = new Date(t.date + 'T12:00:00');
      counts[dObj.getDay()]++;
    });
    
    let maxIdx = 0;
    let maxVal = 0;
    for (let i = 0; i < 7; i++) {
      if (counts[i] > maxVal) {
        maxVal = counts[i];
        maxIdx = i;
      }
    }
    const names = ["Domingo", "Segunda", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return maxVal > 0 ? names[maxIdx] : "-";
  }

  function renderChart() {
    const container = document.getElementById('bar-chart');
    if (!container) return;
    container.innerHTML = '';

    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = window.AppDB.formatDateStr(date);

      // Certificar-se de inicializar com demandas
      window.AppDB.ensureDateInitialized(dateStr);

      const dayTasks = window.AppDB.tasks.filter(t => t.date === dateStr);
      const dayTotal = dayTasks.length;
      const dayCompleted = dayTasks.filter(t => t.completed).length;
      
      const percentage = dayTotal > 0 ? (dayCompleted / dayTotal) * 100 : 0;
      const ratio = `${dayCompleted}/${dayTotal}`;

      const wrapper = document.createElement('div');
      wrapper.className = 'chart-bar-wrapper';

      const barHeight = dayTotal > 0 ? `${percentage}%` : '0%';

      wrapper.innerHTML = `
        <div class="chart-bar" style="height: ${barHeight};" data-date="${dateStr}">
          <div class="chart-tooltip">${ratio} Feitas (${Math.round(percentage)}%)</div>
        </div>
        <span class="chart-day-label">${weekdays[date.getDay()]}</span>
        <span class="chart-ratio-label">${ratio}</span>
      `;

      wrapper.querySelector('.chart-bar').addEventListener('click', () => {
        window.AppDB.activeDate = dateStr;
        const picker = document.getElementById('agenda-date-picker');
        if (picker) picker.value = dateStr;
        
        // Ativar aba da agenda
        if (window.AppMain && window.AppMain.switchTab) {
          window.AppMain.switchTab('agenda');
        }
      });

      container.appendChild(wrapper);
    }
  }

  function renderHistoryList() {
    const container = document.getElementById('history-days-list');
    if (!container) return;
    container.innerHTML = '';

    const uniqueDates = [...new Set(window.AppDB.tasks.map(t => t.date))].sort((a, b) => b.localeCompare(a));
    const recentDates = uniqueDates.slice(0, 8);

    if (recentDates.length === 0) {
      container.innerHTML = `<div class="empty-placeholder">Nenhum histórico disponível</div>`;
      return;
    }

    recentDates.forEach(dateStr => {
      const dayTasks = window.AppDB.tasks.filter(t => t.date === dateStr);
      const total = dayTasks.length;
      const completed = dayTasks.filter(t => t.completed).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      const dateObj = new Date(dateStr + 'T12:00:00');
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      let formatted = dateObj.toLocaleDateString('pt-BR', options);
      formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

      let pctClass = 'low';
      if (percentage >= 50) pctClass = 'mid';
      if (percentage >= 80) pctClass = 'high';

      const row = document.createElement('div');
      row.className = 'history-row';
      row.dataset.date = dateStr;

      row.innerHTML = `
        <div class="history-row-left">
          <span class="history-date">${formatted}</span>
          <span class="history-ratio">${completed} de ${total} demandas concluídas</span>
        </div>
        <div class="history-progress-wrapper">
          <span class="history-percentage ${pctClass}">${percentage}%</span>
        </div>
      `;

      row.addEventListener('click', () => {
        window.AppDB.activeDate = dateStr;
        const picker = document.getElementById('agenda-date-picker');
        if (picker) picker.value = dateStr;
        
        if (window.AppMain && window.AppMain.switchTab) {
          window.AppMain.switchTab('agenda');
        }
      });

      container.appendChild(row);
    });
  }

  window.AppAnalytics = {
    render: function() {
      // 1. Calcular Taxa Geral
      const total = window.AppDB.tasks.length;
      const completed = window.AppDB.tasks.filter(t => t.completed).length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      document.getElementById('stat-completion-rate').textContent = `${rate}%`;
      document.getElementById('stat-total-tasks').textContent = total;

      // 2. Calcular Dia mais Produtivo
      document.getElementById('stat-peak-day').textContent = calculatePeakDay();

      // 3. Renderizar Gráfico 7 Dias
      renderChart();

      // 4. Renderizar Histórico Recente
      renderHistoryList();
    }
  };
})();
