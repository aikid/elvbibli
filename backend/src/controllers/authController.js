const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * POST /auth/request-code - Solicita código de verificação
 */
const requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ erro: 'Email é obrigatório' });
    }

    // Validar formato do email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ erro: 'Email inválido' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verificar rate limit: não permitir novo código antes de 1 minuto
    const recentCode = await VerificationCode.findOne({
      email: normalizedEmail,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }, // Último minuto
    });

    if (recentCode) {
      const secondsLeft = Math.ceil((60 * 1000 - (Date.now() - recentCode.createdAt.getTime())) / 1000);
      return res.status(429).json({
        erro: 'Aguarde antes de solicitar um novo código',
        segundosRestantes: secondsLeft,
      });
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Definir expiração em 10 minutos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Remover códigos antigos do mesmo email
    await VerificationCode.deleteMany({ email: normalizedEmail });

    // Salvar novo código
    await VerificationCode.create({
      email: normalizedEmail,
      code,
      expiresAt,
    });

    // Enviar email com o código
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: normalizedEmail,
        subject: 'Código de Verificação - Biblioteca Virtual',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Código de Verificação</h2>
            <p>Seu código de verificação é:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #666;">Este código expira em 10 minutos.</p>
            <p style="color: #666; font-size: 12px;">Se você não solicitou este código, ignore este email.</p>
          </div>
        `,
        text: `Seu código de verificação é: ${code}. Este código expira em 10 minutos.`,
      });
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Em desenvolvimento, ainda retornar sucesso mas logar o código
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] Código de verificação para ${normalizedEmail}: ${code}`);
      }
      // Em produção, retornar erro se não conseguir enviar
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ erro: 'Erro ao enviar email. Tente novamente mais tarde.' });
      }
    }

    return res.status(200).json({
      mensagem: 'Código de verificação enviado com sucesso',
      // Em desenvolvimento, retornar o código para facilitar testes
      ...(process.env.NODE_ENV === 'development' && { codigo: code }),
    });
  } catch (error) {
    console.error('Erro ao solicitar código:', error);
    return res.status(500).json({ erro: 'Erro ao processar solicitação', mensagem: error.message });
  }
};

/**
 * POST /auth/verify-code - Verifica código e retorna token JWT
 */
const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ erro: 'Email e código são obrigatórios' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Buscar código de verificação
    const verificationCode = await VerificationCode.findOne({
      email: normalizedEmail,
      code: code.toString(),
    });

    if (!verificationCode) {
      return res.status(400).json({ erro: 'Código inválido' });
    }

    // Verificar se o código expirou
    if (new Date() > verificationCode.expiresAt) {
      await VerificationCode.deleteOne({ _id: verificationCode._id });
      return res.status(400).json({ erro: 'Código expirado. Solicite um novo código.' });
    }

    // Remover código usado
    await VerificationCode.deleteOne({ _id: verificationCode._id });

    // Buscar ou criar usuário
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Criar novo usuário com role 'user' por padrão
      user = await User.create({
        email: normalizedEmail,
        role: 'user',
      });
    }

    // Gerar token JWT válido por 1 dia
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'seu-secret-key-mude-em-producao',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      mensagem: 'Autenticação realizada com sucesso',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ erro: 'Validação falhou', mensagens });
    }
    return res.status(500).json({ erro: 'Erro ao processar verificação', mensagem: error.message });
  }
};

module.exports = {
  requestCode,
  verifyCode,
};
