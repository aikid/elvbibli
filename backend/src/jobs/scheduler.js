const cron = require('node-cron');
const { enviarNotificacaoAtrasados } = require('../services/notificationService');

/**
 * Inicializa os jobs agendados
 */
const iniciarJobs = () => {
  console.log('[Jobs] Inicializando jobs agendados...');

  // Job diário às 9h da manhã para notificar empréstimos atrasados
  // Formato cron: segundo minuto hora dia mês dia-da-semana
  // '0 9 * * *' = todo dia às 9h00
  const jobNotificacaoAtrasados = cron.schedule(
    '0 9 * * *',
    async () => {
      try {
        console.log('[Job] Executando verificação de empréstimos atrasados...');
        const resultado = await enviarNotificacaoAtrasados();

        if (resultado.enviado) {
          console.log(
            `[Job] ✅ Notificação enviada: ${resultado.quantidade} empréstimo(s) atrasado(s) para ${resultado.destinatarios.length} destinatário(s)`
          );
        } else {
          console.log(`[Job] ℹ️ Notificação não enviada: ${resultado.motivo}`);
        }
      } catch (error) {
        console.error('[Job] ❌ Erro ao executar job de notificação:', error.message);
      }
    },
    {
      scheduled: true,
      timezone: 'America/Sao_Paulo',
    }
  );

  console.log('[Jobs] ✅ Job de notificação diária configurado (9h)');

  // Opcional: Job para teste imediato (descomente para testar)
  // setTimeout(async () => {
  //   console.log('[Jobs] Executando teste manual...');
  //   await enviarNotificacaoAtrasados();
  // }, 5000); // Executa 5 segundos após iniciar

  return {
    jobNotificacaoAtrasados,
  };
};

/**
 * Para todos os jobs
 */
const pararJobs = (jobs) => {
  if (jobs?.jobNotificacaoAtrasados) {
    jobs.jobNotificacaoAtrasados.stop();
    console.log('[Jobs] Jobs parados');
  }
};

module.exports = {
  iniciarJobs,
  pararJobs,
};
