# Sistema de Autenticação OTP (One Time Password)

Este documento descreve o sistema de autenticação por email com código de verificação implementado no projeto.

## 📋 Visão Geral

O sistema permite que usuários façam login usando apenas o email, sem necessidade de senha. Um código de 6 dígitos é enviado por email e deve ser verificado para obter acesso.

## 🔧 Configuração do Backend

### Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env` do backend:

```env
# JWT Secret - Use uma string aleatória e segura em produção
JWT_SECRET=sua-chave-secreta-aqui

# Configurações SMTP para envio de emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app  # Para Gmail, use "Senha de App"
SMTP_FROM=seu-email@gmail.com

# Ambiente
NODE_ENV=development  # ou production
```

### Configuração do Gmail

Para usar Gmail como provedor de email:

1. Ative a verificação em duas etapas na sua conta Google
2. Gere uma "Senha de App" em: https://myaccount.google.com/apppasswords
3. Use essa senha no campo `SMTP_PASS`

### Instalação de Dependências

```bash
cd backend
npm install
```

As seguintes dependências foram adicionadas:
- `jsonwebtoken` - Para geração e validação de tokens JWT
- `nodemailer` - Para envio de emails

## 📁 Estrutura de Arquivos Criados/Modificados

### Backend

**Modelos:**
- `backend/src/models/User.js` - Modelo de usuário (email, role)
- `backend/src/models/VerificationCode.js` - Modelo de código de verificação

**Controllers:**
- `backend/src/controllers/authController.js` - Lógica de autenticação

**Middlewares:**
- `backend/src/middlewares/authMiddleware.js` - Validação JWT
- `backend/src/middlewares/adminMiddleware.js` - Verificação de role admin

**Rotas:**
- `backend/src/routes/authRoutes.js` - Rotas de autenticação
- `backend/src/routes/bookRoutes.js` - Atualizado com proteção de rotas

**Configuração:**
- `backend/src/app.js` - Atualizado para incluir rotas de auth
- `backend/package.json` - Dependências adicionadas

### Frontend

**Context:**
- `frontend/src/contexts/AuthContext.tsx` - Gerenciamento de estado de autenticação

**Páginas:**
- `frontend/src/pages/LoginPage.tsx` - Página de login
- `frontend/src/pages/LoginPage.css` - Estilos da página de login

**Serviços:**
- `frontend/src/services/api.ts` - Atualizado com interceptor de autenticação

**Rotas:**
- `frontend/src/App.tsx` - Atualizado com AuthProvider e rota de login

## 🔐 Endpoints da API

### POST /auth/request-code

Solicita um código de verificação por email.

**Request:**
```json
{
  "email": "usuario@email.com"
}
```

**Response:**
```json
{
  "mensagem": "Código de verificação enviado com sucesso"
}
```

**Rate Limit:** 5 tentativas por IP a cada 15 minutos

### POST /auth/verify-code

Verifica o código e retorna token JWT.

**Request:**
```json
{
  "email": "usuario@email.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "mensagem": "Autenticação realizada com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@email.com",
    "role": "user"
  }
}
```

## 🔒 Proteção de Rotas

### Rotas Públicas
- `GET /books` - Listar todos os livros
- `GET /books/:id` - Buscar livro por ID
- `POST /books/:id/avaliacoes` - Adicionar avaliação

### Rotas Protegidas (Apenas Admin)
- `POST /books` - Criar livro
- `PUT /books/:id` - Atualizar livro
- `DELETE /books/:id` - Remover livro

## ⚙️ Regras de Negócio

1. **Código de Verificação:**
   - 6 dígitos numéricos
   - Expira em 10 minutos
   - Rate limit: 1 código por minuto por email

2. **Token JWT:**
   - Válido por 1 dia
   - Contém: userId, email, role

3. **Usuários:**
   - Criados automaticamente no primeiro login
   - Role padrão: `user`
   - Role admin deve ser definida manualmente no banco

## 🎨 Frontend

### LoginPage

A página de login possui dois passos:
1. **Solicitar código:** Usuário insere email e recebe código por email
2. **Verificar código:** Usuário insere código de 6 dígitos

### AuthContext

O contexto fornece:
- `user` - Dados do usuário autenticado
- `token` - Token JWT
- `login(token, user)` - Função para fazer login
- `logout()` - Função para fazer logout
- `isAuthenticated` - Boolean indicando se está autenticado
- `isAdmin` - Boolean indicando se é admin

### Uso do AuthContext

```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Faça login para continuar</div>;
  }
  
  return (
    <div>
      <p>Olá, {user?.email}</p>
      {isAdmin && <p>Você é um administrador</p>}
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

## 🧪 Testes em Desenvolvimento

Em modo `development`, o código de verificação é logado no console e também retornado na resposta da API para facilitar testes:

```json
{
  "mensagem": "Código de verificação enviado com sucesso",
  "codigo": "123456"
}
```

## 📝 Criar Usuário Admin

Para criar um usuário admin, você pode usar o MongoDB diretamente ou criar um script:

```javascript
const User = require('./models/User');

User.findOneAndUpdate(
  { email: 'admin@email.com' },
  { email: 'admin@email.com', role: 'admin' },
  { upsert: true, new: true }
).then(user => {
  console.log('Admin criado:', user);
});
```

## 🚀 Próximos Passos

1. Configurar variáveis de ambiente no servidor de produção
2. Criar interface administrativa no frontend (se necessário)
3. Adicionar página de perfil do usuário
4. Implementar refresh token (opcional)
5. Adicionar logs de auditoria (opcional)
