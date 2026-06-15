# 3A Logistics - Controle de Rotina e Histórico de Desempenho

Uma agenda de trabalho diária interativa, minimalista e altamente responsiva inspirada nas melhores ferramentas de organização do mercado (**Notion**, **Google Calendar** e **Todoist**). O sistema é estruturado em uma arquitetura front-end limpa, modular e otimizada, pronta para ser executada localmente sem a necessidade de dependências complexas.

---

## 🚀 Funcionalidades Principais

* **Abas de Navegação Dinâmicas**:
  * **📅 Agenda Diária**: Linha do tempo dividida por períodos do dia (Manhã, Tarde, Fim do Expediente) com painel lateral fixo para entrada rápida de ideias (*Inbox*).
  * **🎯 Metas Futuras**: Kanban board visual e responsivo para planejar e controlar metas de curto/médio prazo (A Fazer, Em Andamento, Concluído).
  * **📊 Desempenho & Histórico**: Dashboard com indicadores-chave, histórico de dias anteriores e um gráfico de produtividade dos últimos 7 dias.
* **Modelo de Template de Rotina Diária**:
  * Ao navegar para qualquer nova data, a agenda gera automaticamente a lista padrão de tarefas operacionais diárias.
* **Alertas Inteligentes no Calendário**:
  * Nas segundas e sextas-feiras, o sistema insere um alerta amarelo em destaque (`⚠️ IMPORTANTE`) sinalizando a necessidade de confecção da planilha Excel de pagamentos da semana.
* **Interatividade & Persistência**:
  * Botões circulares de checkbox com efeito de transição Todoist.
  * Links interativos nas barras de estatísticas: clique em qualquer dia do histórico ou barra do gráfico para carregar imediatamente a agenda daquela data!
  * Salvamento em tempo real e persistência total via `LocalStorage`.

---

## 📂 Estrutura do Projeto

A organização de pastas foi estruturada de forma modular, respeitando as boas práticas de engenharia de software front-end:

```bash
📂 own-project-3a-logistics/
├── 📂 css/
│   └── styles.css          # Variáveis, design tokens, layout grids e animações
├── 📂 js/
│   ├── db.js               # Gerenciador de persistência local, CRUD e cargas padrões
│   ├── goals.js            # Módulo de renderização do painel Kanban de Metas
│   ├── analytics.js        # Motor de cálculos de performance e render do gráfico
│   └── main.js             # Controlador central, inputs e inicialização do DOM
├── .gitignore              # Arquivos temporários do OS ou IDE ignorados pelo Git
├── LICENSE                 # Licença MIT permissiva de código aberto
├── README.md               # Documentação técnica e guia do usuário
└── index.html              # Ponto de entrada (esqueleto HTML estruturado)
```

---

## 💻 Como Executar o Projeto

Como o código utiliza namespaces globais estruturados na inicialização sequencial e evita módulos locais protegidos por CORS, **você pode executar o projeto de duas formas**:

### Opção 1: Duplo Clique (Sem Servidor Local)
1. Abra a pasta do projeto no explorador de arquivos.
2. Dê um **duplo clique** no arquivo `index.html`. Ele abrirá normalmente e funcionará perfeitamente direto no navegador padrão via protocolo `file://`.

### Opção 2: Servidor Local de Desenvolvimento (Recomendado)
Se preferir rodar com um servidor web para simular um ambiente real:
* Com **VS Code**: Instale a extensão **Live Server** e clique em **Go Live** no canto inferior direito.
* Com **Python**:
  ```bash
  python3 -m http.server 8080
  ```
  E acesse no navegador: `http://localhost:8080`
* Com **Node.js**:
  ```bash
  npx http-server -p 8080
  ```

---

## 🛠️ Tecnologias Utilizadas

* **HTML5** Semântico.
* **CSS3** Moderno (Grid Layouts, Flexbox, Custom CSS Variables, transições cúbicas e Keyframe Animations).
* **JavaScript Vanilla (ES6)** modularizado com escopos protegidos (IIFE).
* **Google Fonts (Inter)**.

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.
