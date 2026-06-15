# 🎉 Agendamento Online - Espaço da 60

Sistema de agendamento para salão de festas em **React 18** + **Vite** com **painel administrativo**.

## 🎨 Características

✅ **Sistema de Booking Completo**
- Calendário interativo com datas disponíveis
- Seleção de horários (Manhã, Tarde, Noite, Dia Completo)
- Formulário com dados do cliente
- Integração com WhatsApp para confirmação

✅ **Painel Administrativo**
- Login seguro
- Gerenciamento de agendamentos
- Filtros por status (Pendente, Confirmado, Concluído, Cancelado)
- Visualização de comprovantes
- Estatísticas e faturamento

✅ **Design Moderno**
- Paleta Preto & Laranja
- Interface responsiva
- Ícones React Icons
- CSS Modules para modularidade

## 🚀 Quick Start

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Black-TKO/espaco60.git
cd espaco60

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo abrirá em `http://localhost:3000`

## 📁 Estrutura de Pastas

```
src/
├── App.jsx                          # Roteamento principal
├── main.jsx                         # Entry point
├── config/
│   └── index.js                     # Configurações globais
├── styles/
│   └── global.css                   # Estilos globais
├── context/
│   ├── BookingContext.jsx           # Gerenciamento de reservas
│   └── ToastContext.jsx             # Notificações
├── hooks/
│   └── useFormattingUtils.js        # Utilitários de formatação
├── components/
│   ├── ProtectedRoute.jsx           # Rota protegida
│   ├── common/
│   │   ├── Header.jsx               # Cabeçalho
│   │   ├── Button.jsx               # Botão reutilizável
│   │   └── Toast.jsx                # Notificações
│   └── booking/
│       ├── Stepper.jsx              # Indicador de etapas
│       └── Calendar.jsx             # Calendário interativo
└── pages/
    ├── BookingPage/                 # Página de agendamento
    └── AdminPage/                   # Painel administrativo
```

## 🔐 Credenciais Padrão

| Campo | Valor |
|-------|-------|
| Senha Admin | `admin2024` |
| URL Admin | `/admin` |

⚠️ **Altere a senha em produção!** Edite `src/config/index.js`

## ⚙️ Configuração

Edite `src/config/index.js` para personalizar:

```javascript
export const CONFIG = {
  salonName: 'Agendamento Online Espaço da 60',
  whatsappNumber: '5521999999999',    // Seu WhatsApp
  pixKey: '(21) 99999-9999',          // Chave PIX
  pixKeyType: 'Telefone',             // Tipo: Telefone | CPF | E-mail | Aleatória
  adminPassword: 'admin2024',         // Senha admin
  closedDays: [0],                    // 0=Domingo, 6=Sábado
  timeSlots: [
    { id: 1, label: 'Manhã', time: '09:00 – 13:00', price: 800 },
    { id: 2, label: 'Tarde', time: '14:00 – 18:00', price: 800 },
    { id: 3, label: 'Noite', time: '19:00 – 23:00', price: 1000 },
    { id: 4, label: 'Dia Completo', time: '09:00 – 23:00', price: 2200 },
  ],
}
```

## 🎨 Paleta de Cores

- **Primário (Preto):** `#000000`
- **Accent (Laranja):** `#FF8C00`
- **Fundo:** `#F5F5F5`
- **Texto:** `#000000`
- **Sucesso:** `#16A34A`
- **Erro:** `#DC2626`

## 📱 Rotas

| Rota | Descrição |
|------|----------|
| `/` | Página de agendamento |
| `/admin` | Login administrativo |
| `/admin/dashboard` | Painel administrativo |

## 💾 Armazenamento de Dados

Os dados são armazenados em `localStorage`:
- **Agendamentos:** `salonBookings`
- **Autenticação:** `adminAuth` (sessionStorage)

## 🔨 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📦 Dependências

- **react** (18.2.0) - Framework UI
- **react-dom** (18.2.0) - Renderização React
- **react-router-dom** (6.20.0) - Roteamento
- **react-icons** (4.12.0) - Ícones
- **vite** (5.0.0) - Build tool

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

1. Build: `npm run build`
2. Upload pasta `dist/` para Netlify

### GitHub Pages

```bash
npm run build
git add dist
git commit -m "Deploy"
git push
```

## 🤝 Contribuindo

Fique à vontade para abrir issues e pull requests!

## 📄 Licença

MIT

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato!

---

**Feito com ❤️ para Espaço da 60**
