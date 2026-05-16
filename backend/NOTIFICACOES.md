# Sistema de Notificação Automática - Biblioteca

## 📧 Notificações Automáticas de Empréstimos Atrasados

O sistema agora possui notificações automáticas que enviam e-mails diariamente sobre empréstimos com mais de 30 dias.

### ⚙️ Como Funciona

1. **Job Automático**: Executa todos os dias às **9h da manhã**
2. **Verificação**: Busca empréstimos ativos com mais de 30 dias
3. **Notificação**: Envia e-mail para todos os administradores cadastrados
4. **Conteúdo**: E-mail com tabela detalhada dos empréstimos atrasados

### 🚀 Instalação

Para ativar as notificações automáticas, instale a dependência `node-cron`:

```bash
cd backend
npm install node-cron
```

### 📝 Configuração

O job já está configurado e iniciará automaticamente quando o servidor for iniciado.

**Horário padrão**: 9h da manhã (Timezone: America/Sao_Paulo)

Para alterar o horário, edite o arquivo `backend/src/jobs/scheduler.js`:

```javascript
// Formato cron: minuto hora dia mês dia-da-semana
'0 9 * * *'  // 9h da manhã
'0 14 * * *' // 2h da tarde
'0 8 * * 1'  // 8h da manhã apenas às segundas-feiras
```

### 📊 Destinatários

Por padrão, o e-mail é enviado para **todos os usuários com role 'admin'** cadastrados no sistema.

### 🧪 Teste Manual

Para testar imediatamente sem esperar o horário agendado:

1. Abra `backend/src/jobs/scheduler.js`
2. Descomente o bloco de teste no final da função `iniciarJobs`:

```javascript
// Opcional: Job para teste imediato (descomente para testar)
setTimeout(async () => {
  console.log('[Jobs] Executando teste manual...');
  await enviarNotificacaoAtrasados();
}, 5000); // Executa 5 segundos após iniciar
```

3. Reinicie o servidor

### 📋 Logs

Os logs do job aparecem no console do servidor:

```
[Jobs] Inicializando jobs agendados...
[Jobs] ✅ Job de notificação diária configurado (9h)
[Job] Executando verificação de empréstimos atrasados...
[Job] ✅ Notificação enviada: 3 empréstimo(s) atrasado(s) para 2 destinatário(s)
```

### ⚡ Funcionalidades Adicionais

**Notificação Manual**: Ainda é possível enviar notificações manualmente através do dashboard:
- Acesse a aba "Empréstimos"
- Clique em "📧 Enviar Notificação"
- Informe o e-mail de destino

**API Endpoint**: 
```
POST /emprestimos/notificar-atrasados
Body: { "emailDestino": "email@exemplo.com" }
```

### 🔧 Troubleshooting

**Problema**: Job não está executando
- Verifique se `node-cron` está instalado: `npm list node-cron`
- Verifique os logs do servidor ao iniciar
- Confirme que o timezone está correto para sua região

**Problema**: E-mails não são enviados
- Verifique as variáveis de ambiente do OAuth (OAUTH_EMAIL_USER, etc.)
- Confirme que há administradores cadastrados no sistema
- Em modo desenvolvimento, os e-mails são apenas logados no console

### 🌍 Timezones Disponíveis

Alguns exemplos de timezones para o Brasil:
- `America/Sao_Paulo` (São Paulo, Brasília)
- `America/Manaus` (Manaus)
- `America/Fortaleza` (Fortaleza, Recife)
- `America/Belem` (Belém)

Para ver todos os timezones disponíveis: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
