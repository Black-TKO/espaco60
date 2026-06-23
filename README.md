
---

## Detalhamento de Arquivos Importantes

### 1. src/main.jsx (Entrada da Aplicacao)

Localizacao: src/main.jsx
Tamanho: 208 bytes
Funcao: Monta o React no elemento #root do HTML

Renderiza App.jsx dentro de StrictMode para deteccao de efeitos colaterais

---

### 2. src/App.jsx (Rotas Principais)

Localizacao: src/App.jsx
Tamanho: 690 bytes
Funcao: Define todas as rotas da aplicacao

Rotas:
- / → BookingPage (Agendamento publico)
- /admin/login → AdminLogin (Login do admin)
- /admin/* → AdminPanel (Dashboard protegido)

Protecao: RequireAuth protege rotas administrativas

---

### 3. src/config/config.js (Configuracao Central)

Localizacao: src/config/config.js (tambem em src/config.js)
Tamanho: ~1KB
Funcao: Centraliza todas as configuracoes do sistema

Propriedades principais:
- salonName - Nome do salao
- whatsappNumber - Numero para envio de mensagens
- pixKey - Chave PIX para recebimento
- adminPassword - Senha do painel admin (ALERTA: nao seguro)
- closedDays - Dias sem atendimento (0=Dom, 6=Sab)
- timeSlots - Periodos disponiveis com precos

---

### 4. src/components/ (Componentes da UI)

Calendar.jsx - Seletor de Datas
  - Permite selecionar uma data do calendario
  - Valida dias fechados
  - Exclui datas passadas

Stepper.jsx - Indicador de Progresso
  - Mostra em qual passo do agendamento o usuario esta
  - 5 passos no total

Header.jsx - Cabecalho
  - Exibe logo e nome do salao
  - Componente reutilizavel

PricingEditor.jsx - Editor de Precos
  - Permite admin editar precos dos periodos
  - Salva em localStorage

RequireAuth.jsx - Protecao de Rota
  - HOC (Higher Order Component)
  - Verifica se usuario esta logado
  - Redireciona para /admin/login se nao autenticado

Step1Date.jsx - Step5Confirm.jsx - Wizard de Agendamento
Fluxo de 5 passos:
  1. Step1Date - Selecao de data
  2. Step2Slots - Escolha do periodo
  3. Step3Payment - Escolha forma de pagamento
  4. Step4Receipt - Visualizacao e download do recibo
  5. Step5Confirm - Confirmacao do agendamento

---

### 5. src/pages/ (Paginas/Rotas)

BookingPage.jsx - Pagina de Agendamento
  Localizacao: src/pages/BookingPage.jsx
  Funcao: Container principal do fluxo de agendamento
  Componentes filhos: Stepper + Steps 1-5

AdminLogin.jsx - Login do Admin
  Localizacao: src/pages/AdminLogin.jsx
  Funcao: Formulario de autenticacao
  Valida: Senha configurada em config.js

AdminPanel.jsx - Dashboard Principal
  Localizacao: src/pages/AdminPanel.jsx
  Tamanho: ~17KB
  Funcao: Painel administrativo completo

  Funcionalidades:
  - Listar todos os agendamentos
  - Editar/deletar agendamentos
  - Gerar relatorios e exportar para Excel
  - Editar precos dos periodos
  - Buscar e filtrar agendamentos

AdminPage.jsx - Painel Alternativo
  Similar ao AdminPanel.jsx, painel de admin

---

### 6. src/hooks/ (Logica Compartilhada)

useBooking.js - Gerenciamento de Agendamentos
  Tamanho: 6.2KB
  Responsabilidades:
  - CRUD de agendamentos
  - Persistencia em localStorage
  - Validacao de disponibilidade
  - Geracao de IDs unicos
  - Formatacao de dados

useToast.js - Notificacoes
  Tamanho: 305 bytes
  Responsabilidades:
  - Exibir mensagens de sucesso/erro
  - Controle de visibilidade de toasts

---

### 7. src/data/ (Armazenamento Local)

bookings.json
  Funcao: Exemplo de estrutura de agendamentos
  Utilizado por: useBooking.js (carregado em localStorage)
  
  Exemplo de entrada:
  {
    "id": "1",
    "date": "2026-06-25",
    "period": "Manha",
    "clientName": "Joao Silva",
    "clientPhone": "21999999999",
    "paymentMethod": "PIX",
    "price": 800
  }

timeSlots.json
  Funcao: Periodos disponiveis do salao

pricing.json
  Funcao: Tabela de precos alternativa

---

### 8. src/utils/helpers.js (Funcoes Auxiliares)

Tamanho: 5.8KB
Funcao: Utilitarios para:
- Formatacao de datas e horas
- Validacao de entrada
- Geracao de QR codes
- Geracao de PDFs com recibos
- Exportacao para Excel
- Formatacao de moeda

Principais funcoes:
- formatDate() - Formata datas
- generateQRCode() - Cria QR code do agendamento
- generatePDF() - Cria recibo em PDF
- exportToExcel() - Exporta dados para Excel

---

### 9. src/styles/ (Estilos)

global.scss - Estilos Globais
  Tamanho: ~31KB
  Contem:
  - Reset de estilos
  - Variaveis CSS
  - Componentes globais
  - Responsividade

_tokens.scss - Tokens de Design
  Localizacao: src/styles/partials/_tokens.scss
  Contem:
  - Paleta de cores
  - Tipografia
  - Espacamentos
  - Shadows e borderRadius

PricingEditor.scss
  Funcao: Estilos especificos do editor de precos

---

## Funcionalidades por Modulo

### Fluxo de Agendamento do Cliente

1. Seleciona Data (Calendar + Step1Date)
   PARA
2. Escolhe Periodo (Step2Slots)
   - Manha (09:00-13:00)
   - Tarde (14:00-18:00)
   - Noite (19:00-23:00)
   - Dia Completo (09:00-23:00)
   PARA
3. Seleciona Pagamento (Step3Payment)
   - PIX
   - Transferencia Bancaria
   - Dinheiro
   PARA
4. Visualiza Recibo (Step4Receipt)
   - Dados do agendamento
   - QR Code para validacao
   - Download PDF
   - Compartilhamento
   PARA
5. Confirma Agendamento (Step5Confirm)
   - Salva em localStorage e backend

### Painel Administrativo

Login Admin
   PARA
Dashboard com:
- Lista de Agendamentos
- Busca/Filtros
- Edicao de Agendamentos
- Delecao de Agendamentos
- Editor de Precos
- Exportacao para Excel
- Geracao de Relatorios

---

## Instalacao e Configuracao

### Pre-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clonar o Repositorio
git clone https://github.com/Black-TKO/espaco60.git
cd espaco60

### 2. Instalar Dependencias
npm install

### 3. Configurar Variaveis de Ambiente
cp .env.template .env.local

Edite .env.local com suas configuracoes:

VITE_SALON_NAME=Espaco da 60
VITE_WHATSAPP_NUMBER=5521999999999
VITE_PIX_KEY=seu_pix_aqui
VITE_ADMIN_PASSWORD=sua_senha_aqui

### 4. Modificar Configuracoes (IMPORTANTE)
Edite src/config/config.js:

export const CONFIG = {
  salonName:      'Seu Salao',
  whatsappNumber: 'Seu numero (55 + DDD + numero)',
  pixKey:         'Sua chave PIX',
  pixKeyType:     'Telefone|CPF|E-mail|Aleatoria',
  adminPassword:  'MUDE ESTA SENHA!',
  closedDays:     [0, 6],
  timeSlots: [ /* seus periodos */ ]
};

### 5. Executar em Desenvolvimento
npm run dev

Acesse: http://localhost:5173

### 6. Build para Producao
npm run build

### 7. Preview da Build
npm run preview

---

## Seguranca

IMPORTANTE:
- Senha do admin está em config.js (nao é seguro para producao)
- Para producao, implementar autenticacao real (JWT, OAuth, etc)
- Dados salvos em localStorage sao visiveis ao cliente
- Implementar backend para persistencia segura

---

## Fluxo de Dados

Cliente
   PARA
BookingPage (UI)
   PARA
Step1-5 (Componentes)
   PARA
useBooking (Hook - logica)
   PARA
localStorage (Persistencia local)
   PARA
helpers.js (Formatacao/Export)
   PARA
PDF/Excel/QR (Saida)

---

## Troubleshooting

Problema: Agendamentos nao salvam
Solucao: Verificar se localStorage esta habilitado no navegador

Problema: Calendario nao mostra datas
Solucao: Verificar closedDays e validacao de datas em Calendar.jsx

Problema: PDF nao gera
Solucao: Verificar se html2canvas e jsPDF estao instalados

Problema: Admin nao consegue logar
Solucao: Verificar senha em src/config/config.js

---

## Proximas Melhorias Sugeridas

- Integrar com backend real (Node/Express, Python, etc)
- Implementar autenticacao segura (JWT)
- Database para persistencia (MongoDB, PostgreSQL)
- Envio de email/SMS de confirmacao
- Integracao com PIX real
- Geolocalizacao de agendamentos
- Sistema de avaliacoes
- Dashboard com graficos (Charts.js, Recharts)
- Testes automatizados (Jest, React Testing Library)
- PWA (Progressive Web App)

---

## Suporte

Para duvidas ou problemas, abra uma issue no GitHub:
https://github.com/Black-TKO/espaco60/issues

---

Ultima atualizacao: Junho 2026
Versao: 0.0.0 (Alpha)
