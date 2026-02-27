const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Simples armazenamento em memória (substituir por banco depois)
const codes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro serviço
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.requestCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-mail obrigatório.' });

  const code = crypto.randomInt(100000, 999999).toString();
  codes[email] = { code, expires: Date.now() + 10 * 60 * 1000 }; // 10 min

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de acesso administrativo',
      text: `Seu código: ${code}`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar e-mail.' });
  }
};

exports.validateCode = (req, res) => {
  const { email, code } = req.body;
  const entry = codes[email];
  if (!entry || entry.code !== code || Date.now() > entry.expires) {
    return res.status(401).json({ error: 'Código inválido ou expirado.' });
  }
  delete codes[email];
  // Aqui pode gerar um token JWT para autenticação
  res.json({ success: true });
};
