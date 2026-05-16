# 📧 Como Configurar Senha de App do Gmail

## ⚠️ Problema Resolvido

O sistema foi atualizado para usar **Senha de App do Gmail** em vez de OAuth2, que é mais simples e estável.

## 🔧 Passo a Passo para Gerar a Senha de App

### 1. **Ativar Verificação em 2 Etapas** (se ainda não tiver)

1. Acesse: https://myaccount.google.com/security
2. Procure por **"Verificação em duas etapas"**
3. Clique em **"Ativar"** e siga as instruções

### 2. **Gerar Senha de App**

1. Acesse: https://myaccount.google.com/apppasswords
2. Faça login na sua conta Google (**klonoa51@gmail.com**)
3. No campo **"Selecionar app"**, escolha **"Mail"** ou **"Outro (nome personalizado)"**
4. Se escolher "Outro", digite: **"Biblioteca Virtual"**
5. Clique em **"Gerar"**
6. O Google mostrará uma senha de 16 caracteres como: **"xxxx xxxx xxxx xxxx"**
7. **COPIE** essa senha (sem os espaços)

### 3. **Configurar no Sistema**

Edite o arquivo: **`backend/.env`**

```env
EMAIL_USER=klonoa51@gmail.com
EMAIL_PASS=xxxxxxxxxxxx
```

Substitua `xxxxxxxxxxxx` pela senha de 16 caracteres gerada (remova os espaços).

**Exemplo:**
- Senha gerada: `abcd efgh ijkl mnop`
- Cole no .env: `EMAIL_PASS=abcdefghijklmnop`

### 4. **Reiniciar o Servidor**

```bash
cd backend
npm run dev
```

## ✅ Pronto!

Agora o sistema funcionará perfeitamente para:
- ✉️ Envio de códigos de verificação no login
- 📧 Notificações automáticas de empréstimos atrasados
- 🔔 Alertas manuais via dashboard

## 🔒 Segurança

- ⚠️ **NUNCA** compartilhe sua senha de app
- ⚠️ **NUNCA** faça commit do arquivo `.env` para o GitHub
- ✅ A senha de app é específica para este sistema
- ✅ Você pode revogá-la a qualquer momento em: https://myaccount.google.com/apppasswords

## 🆘 Problemas?

**Erro: "Invalid login"**
- Verifique se a verificação em 2 etapas está ativa
- Gere uma nova senha de app
- Certifique-se de copiar a senha sem espaços

**Erro: "Username and Password not accepted"**
- Verifique se o EMAIL_USER está correto
- Gere nova senha de app
- Confirme que não há espaços na senha

**Erro: "invalid_grant: Bad Request"**
- Isso significa que você ainda está usando OAuth2 antigo
- Certifique-se de ter reiniciado o servidor após editar o .env

## 📌 Notas Importantes

1. **Não** use a senha normal da sua conta Google
2. **Sim**, use a senha de app gerada especificamente
3. Cada senha de app é única para cada aplicação
4. Você pode ter várias senhas de app ativas simultaneamente
5. A senha de app tem 16 caracteres alfanuméricos (sem espaços)

---

## 🎯 Por que mudamos de OAuth2 para Senha de App?

- ✅ **Mais simples**: Não precisa gerenciar tokens
- ✅ **Mais estável**: Não expira automaticamente
- ✅ **Mais confiável**: Menos pontos de falha
- ✅ **Fácil renovação**: Gera nova senha em 30 segundos
- ✅ **Sem erros invalid_grant**: Problema resolvido permanentemente

## 🔄 Migrando de OAuth2

As variáveis antigas do OAuth2 foram comentadas no `.env`. Você não precisa apagá-las, mas elas não são mais usadas:

```env
# OAUTH_REFRESH_TOKEN=...
# OAUTH_TOKEN=...
# OAUTH_EMAIL_USER=...
# OAUTH_CLIENT_ID=...
# OAUTH_CLIENT_SECRET=...
```

Agora o sistema usa apenas:

```env
EMAIL_USER=klonoa51@gmail.com
EMAIL_PASS=sua_senha_de_app
```

Muito mais simples! 🎉
