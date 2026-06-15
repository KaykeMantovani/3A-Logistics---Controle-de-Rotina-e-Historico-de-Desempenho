# 3A Logistics - Painel de Produtividade Diária

Painel interativo e moderno focado no controle operacional de rotinas logísticas, administrativas e financeiras para a **3A Logistics**.

## 🚀 Funcionalidades

- **Carga de Rotina Diária**: Inicialização automática com as tarefas essenciais do dia caso o armazenamento esteja vazio.
- **Smart Tags (Categorização Automática)**:
  - 🏨 **Hotel**: Identificada quando o texto contém "hotel" ou "hoteis".
  - 💼 **Financeiro / Diretoria**: Identificada quando o texto contém "chefe", "pagamento", "boleto" ou "passar".
- **Ordenação Inteligente**: 
  - Demandas marcadas como **Urgente** ou vinculadas a tags **Financeiras** são fixadas no topo com destaque visual (borda vermelha).
  - Tarefas marcadas como **Concluídas** descem para o final com opacidade reduzida e texto tachado.
- **Persistência**: Progresso salvo no `LocalStorage` do navegador em tempo real.
- **Métricas do Dia**: Indicador de progresso dinâmico com porcentagem e data por extenso em português.

---

## 💻 Como Abrir e Executar o Painel

Como este projeto foi construído utilizando **HTML5, CSS3 e JavaScript Vanilla** de forma totalmente autônoma, ele não necessita de nenhuma instalação de dependências ou build.

Você pode abri-lo de três formas super simples:

### Opção 1: Abrir diretamente pelo arquivo (Mais Fácil)
1. Abra a pasta do projeto no explorador de arquivos do seu sistema operacional.
2. Dê um **duplo clique** no arquivo `index.html`. Ele será aberto imediatamente no seu navegador padrão.

### Opção 2: Pelo menu do seu Navegador
1. Abra o seu navegador preferido (Google Chrome, Firefox, Microsoft Edge, etc).
2. Pressione o atalho `Ctrl + O` (no Windows/Linux) ou `Cmd + O` (no Mac).
3. Selecione o arquivo `index.html` na pasta do projeto e clique em **Abrir**.

### Opção 3: Usando um Servidor Local Rápido (Opcional - Recomendado para Devs)
Se você tem o Python instalado no seu terminal:
```bash
python3 -m http.server 8080
```
Depois, acesse no navegador: `http://localhost:8080`

Ou, caso use o **VS Code**, basta instalar a extensão **Live Server** e clicar em **Go Live** no canto inferior direito.
