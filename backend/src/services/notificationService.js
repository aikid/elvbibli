const Emprestimo = require('../models/Emprestimo');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Busca empréstimos atrasados (mais de 30 dias)
 */
const getEmprestimosAtrasados = async () => {
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

  const emprestimosAtrasados = await Emprestimo.find({
    status: 'ativo',
    dataPegou: { $lt: trintaDiasAtras },
  })
    .populate('livro')
    .sort({ dataPegou: 1 }); // Mais antigos primeiro

  // Calcular dias de atraso
  return emprestimosAtrasados.map((emp) => {
    const hoje = new Date();
    const diasDesdeEmprestimo = Math.floor((hoje - emp.dataPegou) / (1000 * 60 * 60 * 24));
    const diasAtraso = diasDesdeEmprestimo - 30;

    return {
      ...emp.toObject(),
      diasAtraso,
      diasDesdeEmprestimo,
    };
  });
};

/**
 * Monta o HTML do e-mail com empréstimos atrasados
 */
const montarEmailHtml = (emprestimosComAtraso) => {
  const listaHtml = emprestimosComAtraso
    .map(
      (emp) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${emp.livro?.titulo || 'N/A'}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${emp.pessoa}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${new Date(emp.dataPegou).toLocaleDateString('pt-BR')}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #d32f2f; font-weight: bold;">${emp.diasAtraso} dias</td>
        </tr>
      `
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #d32f2f; border-bottom: 3px solid #d32f2f; padding-bottom: 10px;">
        ⚠️ Alerta: Empréstimos Atrasados
      </h2>
      <p style="font-size: 16px; color: #333;">
        Os seguintes empréstimos estão com <strong>mais de 30 dias</strong> e precisam de atenção:
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Livro</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Pessoa</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Data Empréstimo</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Dias de Atraso</th>
          </tr>
        </thead>
        <tbody>
          ${listaHtml}
        </tbody>
      </table>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        <strong>Total de empréstimos atrasados:</strong> ${emprestimosComAtraso.length}
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />
      
      <p style="color: #999; font-size: 12px;">
        Este é um e-mail automático da Biblioteca da Igreja. Por favor, tome as ações necessárias para recuperar os livros.
      </p>
    </div>
  `;
};

/**
 * Envia notificação por e-mail sobre empréstimos atrasados
 */
const enviarNotificacaoAtrasados = async (emailDestino = null) => {
  try {
    // Buscar empréstimos atrasados
    const emprestimosComAtraso = await getEmprestimosAtrasados();

    if (emprestimosComAtraso.length === 0) {
      console.log('[Notificação] Nenhum empréstimo atrasado para notificar');
      return { enviado: false, motivo: 'sem_atrasados' };
    }

    // Se não especificado, buscar todos os admins
    let destinatarios = [];
    if (emailDestino) {
      destinatarios = [emailDestino];
    } else {
      // Buscar e-mails de todos os admins
      const admins = await User.find({ role: 'admin' }).select('email');
      destinatarios = admins.map((admin) => admin.email);
    }

    if (destinatarios.length === 0) {
      console.log('[Notificação] Nenhum destinatário encontrado');
      return { enviado: false, motivo: 'sem_destinatarios' };
    }

    const htmlEmail = montarEmailHtml(emprestimosComAtraso);

    // Enviar e-mail
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: destinatarios.join(', '),
        subject: `⚠️ Alerta: ${emprestimosComAtraso.length} empréstimo(s) atrasado(s) - Biblioteca`,
        html: htmlEmail,
        text: `Há ${emprestimosComAtraso.length} empréstimo(s) com mais de 30 dias que precisam de atenção.`,
      });

      console.log(
        `[Notificação] E-mail enviado com sucesso para ${destinatarios.length} destinatário(s): ${destinatarios.join(', ')}`
      );
      console.log(`[Notificação] ${emprestimosComAtraso.length} empréstimo(s) atrasado(s) reportado(s)`);

      return {
        enviado: true,
        quantidade: emprestimosComAtraso.length,
        destinatarios,
      };
    } catch (emailError) {
      console.error('[Notificação] Erro ao enviar e-mail:', emailError.message);

      // Em desenvolvimento, logar mas não falhar
      if (process.env.NODE_ENV === 'development') {
        console.log('[DEV] Notificação seria enviada para:', destinatarios.join(', '));
        console.log('[DEV] Empréstimos atrasados:', emprestimosComAtraso.length);
        return {
          enviado: false,
          motivo: 'modo_dev',
          quantidade: emprestimosComAtraso.length,
          destinatarios,
        };
      }

      throw emailError;
    }
  } catch (error) {
    console.error('[Notificação] Erro ao processar notificação:', error.message);
    throw error;
  }
};

module.exports = {
  getEmprestimosAtrasados,
  enviarNotificacaoAtrasados,
};
