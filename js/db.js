(function() {
  // Helpers de formatação de data local
  function toISOStringLocal(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getPastDateStr(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    return toISOStringLocal(d);
  }

  const todayStr = toISOStringLocal(new Date());

  // Rotina de demandas diárias padrão
  function getRoutineTasksForDate(dateStr) {
    const dObj = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = dObj.getDay(); // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
    
    // Sábado ou Domingo: Dia de descanso (Folga)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [
        {
          id: 'r_rest_' + dateStr,
          text: "Dia de descanso 😴 - Aproveite o fim de semana!",
          period: "manha",
          completed: true,
          createdAt: Date.now(),
          date: dateStr,
          isRestDay: true
        }
      ];
    }

    const dayRoutine = [
      { id: 'r1_' + dateStr, text: "Checar e-mails, Usecar e Docusign", period: "manha", completed: false, createdAt: Date.now() - 50000, date: dateStr },
      { id: 'r2_' + dateStr, text: "Responder mensagens de funcionários e hotéis", period: "manha", completed: false, createdAt: Date.now() - 40000, date: dateStr },
      { id: 'r3_' + dateStr, text: "Revisar e regulamentar pendências de hotéis da semana", period: "tarde", completed: false, createdAt: Date.now() - 30000, date: dateStr },
      { id: 'r4_' + dateStr, text: "Compilar e passar pagamentos pendentes da semana para a chefe", period: "tarde", completed: false, createdAt: Date.now() - 20000, date: dateStr },
      { id: 'r5_' + dateStr, text: "Organizar documentos físicos e realizar impressões necessárias", period: "noite", completed: false, createdAt: Date.now() - 10000, date: dateStr }
    ];
    
    // Alerta Excel de pagamentos importantes às segundas (1) e sextas (5)
    if (dayOfWeek === 1 || dayOfWeek === 5) {
      dayRoutine.unshift({
        id: 'r_alert_' + dateStr,
        text: "Fazer planilha Excel com os pagamentos da semana",
        period: "manha",
        completed: false,
        createdAt: Date.now() - 60000,
        date: dateStr,
        isAlert: true
      });
    }
    
    return dayRoutine;
  }

  // Banco de demandas inicial padrão para fins históricos
  const defaultTasks = [
    { id: 'y1', text: "Realizar conciliação bancária matinal", period: "manha", completed: true, createdAt: Date.now() - 86400000, date: getPastDateStr(1) },
    { id: 'y2', text: "Arquivar boletos do Usecar", period: "tarde", completed: true, createdAt: Date.now() - 86400000 + 10, date: getPastDateStr(1) },
    { id: 'y3', text: "Revisar check-in dos hotéis cadastrados", period: "tarde", completed: true, createdAt: Date.now() - 86400000 + 20, date: getPastDateStr(1) },
    { id: 'y4', text: "Telefonar para chefe para alinhar relatórios", period: "manha", completed: false, createdAt: Date.now() - 86400000 + 30, date: getPastDateStr(1) },

    { id: 'd2_1', text: "Responder dúvidas sobre faturamento", period: "manha", completed: true, createdAt: Date.now() - 172800000, date: getPastDateStr(2) },
    { id: 'd2_2', text: "Auditar faturas de hotéis pendentes", period: "tarde", completed: true, createdAt: Date.now() - 172800000 + 10, date: getPastDateStr(2) },
    { id: 'd2_3', text: "Enviar documentos Docusign assinados", period: "noite", completed: true, createdAt: Date.now() - 172800000 + 20, date: getPastDateStr(2) },

    { id: 'd3_1', text: "Organizar fluxo de caixa", period: "tarde", completed: true, createdAt: Date.now() - 259200000, date: getPastDateStr(3) },
    { id: 'd3_2', text: "Enviar e-mails de cobrança", period: "manha", completed: false, createdAt: Date.now() - 259200000 + 10, date: getPastDateStr(3) },

    { id: 'd4_1', text: "Compilar dados operacionais do Docusign", period: "tarde", completed: true, createdAt: Date.now() - 345600000, date: getPastDateStr(4) },
    { id: 'd4_2', text: "Responder e-mails de hotéis urgentes", period: "manha", completed: true, createdAt: Date.now() - 345600000 + 10, date: getPastDateStr(4) }
  ];

  // Banco de metas inicial padrão
  const defaultGoals = [
    { id: 'g1', text: "Digitalizar todo o arquivo físico de faturas", status: "in_progress", createdAt: Date.now() - 100000 },
    { id: 'g2', text: "Automatizar relatórios de hotéis usando scripts", status: "todo", createdAt: Date.now() - 80000 },
    { id: 'g3', text: "Renovar contrato com plataforma de assinatura eletrônica", status: "done", createdAt: Date.now() - 50000 }
  ];

  // Namespacing Global
  window.AppDB = {
    tasks: [],
    goals: [],
    activeDate: todayStr,

    init: function() {
      // Carregar tarefas
      try {
        const storedTasks = localStorage.getItem('3a_logistics_notion_agenda');
        if (storedTasks) {
          this.tasks = JSON.parse(storedTasks);
        } else {
          this.tasks = [...defaultTasks];
          this.saveTasks();
        }
      } catch (e) {
        console.error("Erro ao carregar banco de dados", e);
        this.tasks = [...defaultTasks];
      }

      // Carregar metas
      try {
        const storedGoals = localStorage.getItem('3a_logistics_goals');
        if (storedGoals) {
          this.goals = JSON.parse(storedGoals);
        } else {
          this.goals = [...defaultGoals];
          this.saveGoals();
        }
      } catch (e) {
        console.error("Erro ao carregar metas", e);
        this.goals = [...defaultGoals];
      }
    },

    saveTasks: function() {
      localStorage.setItem('3a_logistics_notion_agenda', JSON.stringify(this.tasks));
    },

    saveGoals: function() {
      localStorage.setItem('3a_logistics_goals', JSON.stringify(this.goals));
    },

    ensureDateInitialized: function(dateStr) {
      const existing = this.tasks.filter(t => t.date === dateStr);
      if (existing.length === 0) {
        const routine = getRoutineTasksForDate(dateStr);
        this.tasks.push(...routine);
        this.saveTasks();
      }
    },

    // CRUD de Tarefas
    addTask: function(text, period) {
      const newTask = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
        text: text.trim(),
        period: period,
        completed: false,
        createdAt: Date.now(),
        date: this.activeDate
      };
      this.tasks.push(newTask);
      this.saveTasks();
      return newTask;
    },

    toggleTask: function(id) {
      this.tasks = this.tasks.map(t => {
        if (t.id === id) return { ...t, completed: !t.completed };
        return t;
      });
      this.saveTasks();
    },

    moveTask: function(id, newPeriod) {
      this.tasks = this.tasks.map(t => {
        if (t.id === id) return { ...t, period: newPeriod };
        return t;
      });
      this.saveTasks();
    },

    deleteTask: function(id, callback) {
      const card = document.querySelector(`.task-item[data-id="${id}"]`);
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';
        card.style.transition = 'all 0.25s ease';
        setTimeout(() => {
          this.tasks = this.tasks.filter(t => t.id !== id);
          this.saveTasks();
          if (callback) callback();
        }, 250);
      } else {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        if (callback) callback();
      }
    },

    // CRUD de Metas
    addGoal: function(text, status) {
      const newGoal = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
        text: text.trim(),
        status: status,
        createdAt: Date.now()
      };
      this.goals.push(newGoal);
      this.saveGoals();
      return newGoal;
    },

    moveGoal: function(id, newStatus) {
      this.goals = this.goals.map(g => {
        if (g.id === id) return { ...g, status: newStatus };
        return g;
      });
      this.saveGoals();
    },

    deleteGoal: function(id) {
      this.goals = this.goals.filter(g => g.id !== id);
      this.saveGoals();
    },

    // Auxiliares úteis externos
    formatDateStr: toISOStringLocal,
    getPastDateStr: getPastDateStr
  };
})();
