const Emprestimo = require('../models/Emprestimo');
const Book = require('../models/Book');
const { getEmprestimosAtrasados, enviarNotificacaoAtrasados } = require('../services/notificationService');
const { extrairTexto, encontrarLivroNoTexto } = require('../services/ocrService');

/**
 * GET /emprestimos - Lista todos os empréstimos
 */
const listAll = async (req, res) => {
  try {
    const emprestimos = await Emprestimo.find({}).populate('livro').sort({ dataPegou: -1 });
    return res.status(200).json(emprestimos);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao listar empréstimos', mensagem: error.message });
  }
};

/**
 * GET /emprestimos/:id - Busca empréstimo por id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const emprestimo = await Emprestimo.findById(id).populate('livro');

    if (!emprestimo) {
      return res.status(404).json({ erro: 'Empréstimo não encontrado' });
    }

    return res.status(200).json(emprestimo);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    return res.status(500).json({ erro: 'Erro ao buscar empréstimo', mensagem: error.message });
  }
};

/**
 * POST /emprestimos - Cria novo empréstimo
 */
const create = async (req, res) => {
  try {
    const { livroId, pessoa } = req.body;

    if (!livroId || !pessoa) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: livroId, pessoa',
      });
    }

    const book = await Book.findById(livroId);

    if (!book) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    // Verificar se ainda há quantidade disponível
    const emprestimosAtivos = await Emprestimo.countDocuments({
      livro: livroId,
      status: 'ativo',
    });

    if (emprestimosAtivos >= book.quantidade) {
      return res.status(400).json({ erro: 'Sem cópias disponíveis para emprestar' });
    }

    const emprestimo = await Emprestimo.create({
      livro: livroId,
      pessoa: pessoa.trim(),
    });

    // Adiciona referência do empréstimo ao book (mantemos apenas empréstimos ativos no array)
    await Book.findByIdAndUpdate(livroId, { $push: { emprestimos: emprestimo._id } });

    const emprestimoPopulado = await Emprestimo.findById(emprestimo._id).populate('livro');

    return res.status(201).json(emprestimoPopulado);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ erro: 'Validação falhou', mensagens });
    }
    return res.status(500).json({ erro: 'Erro ao criar empréstimo', mensagem: error.message });
  }
};

/**
 * PUT /emprestimos/:id/devolver - Marca empréstimo como devolvido
 */
const devolver = async (req, res) => {
  try {
    const { id } = req.params;

    const emprestimo = await Emprestimo.findById(id).populate('livro');

    if (!emprestimo) {
      return res.status(404).json({ erro: 'Empréstimo não encontrado' });
    }

    if (emprestimo.status === 'devolvido') {
      return res.status(400).json({ erro: 'Este empréstimo já foi devolvido' });
    }

    emprestimo.status = 'devolvido';
    emprestimo.dataDevolucao = new Date();

    await emprestimo.save();

    // Remover referência do empréstimo do Book (já não é mais ativo)
    try {
      const livroId = emprestimo.livro && emprestimo.livro._id ? emprestimo.livro._id : emprestimo.livro;
      await Book.findByIdAndUpdate(livroId, { $pull: { emprestimos: emprestimo._id } });
    } catch (e) {
      // não bloquear devolução por falha em atualizar o livro
      console.warn('Falha ao atualizar Book ao devolver:', e.message);
    }

    return res.status(200).json(emprestimo);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    return res.status(500).json({ erro: 'Erro ao devolver empréstimo', mensagem: error.message });
  }
};

/**
 * GET /emprestimos/livro/:livroId - Lista empréstimos por livro
 */
const getByLivroId = async (req, res) => {
  try {
    const { livroId } = req.params;

    const emprestimos = await Emprestimo.find({ livro: livroId })
      .populate('livro')
      .sort({ dataPegou: -1 });

    return res.status(200).json(emprestimos);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    return res.status(500).json({ erro: 'Erro ao listar empréstimos', mensagem: error.message });
  }
};

/**
 * DELETE /emprestimos/:id - Remove empréstimo (apenas se não devolvido)
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const emprestimo = await Emprestimo.findById(id);

    if (!emprestimo) {
      return res.status(404).json({ erro: 'Empréstimo não encontrado' });
    }

    if (emprestimo.status === 'devolvido') {
      return res.status(400).json({ erro: 'Não é possível remover empréstimos já devolvidos' });
    }
    // Remover referência do empréstimo do livro se existente
    try {
      await Book.findByIdAndUpdate(emprestimo.livro, { $pull: { emprestimos: emprestimo._id } });
    } catch (e) {
      console.warn('Falha ao atualizar Book ao remover empréstimo:', e.message);
    }

    await Emprestimo.findByIdAndDelete(id);

    return res.status(200).json({ mensagem: 'Empréstimo removido com sucesso' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    return res.status(500).json({ erro: 'Erro ao remover empréstimo', mensagem: error.message });
  }
};

/**
 * GET /emprestimos/atrasados - Lista empréstimos atrasados (mais de 30 dias)
 */
const getAtrasados = async (req, res) => {
  try {
    const emprestimosComAtraso = await getEmprestimosAtrasados();
    return res.status(200).json(emprestimosComAtraso);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar empréstimos atrasados', mensagem: error.message });
  }
};

/**
 * POST /emprestimos/notificar-atrasados - Envia e-mails de notificação sobre empréstimos atrasados
 */
const sendNotificacoes = async (req, res) => {
  try {
    const { emailDestino } = req.body;

    if (!emailDestino) {
      return res.status(400).json({ erro: 'Email de destino é obrigatório' });
    }

    const resultado = await enviarNotificacaoAtrasados(emailDestino);

    if (!resultado.enviado) {
      if (resultado.motivo === 'sem_atrasados') {
        return res.status(200).json({
          mensagem: 'Nenhum empréstimo atrasado para notificar',
          enviados: 0,
        });
      }
      
      if (resultado.motivo === 'modo_dev') {
        return res.status(200).json({
          mensagem: 'Email não enviado (modo desenvolvimento)',
          enviados: resultado.quantidade,
          emailDestino,
        });
      }
    }

    return res.status(200).json({
      mensagem: 'Notificação enviada com sucesso',
      enviados: resultado.quantidade,
      emailDestino: resultado.destinatarios,
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return res.status(500).json({ erro: 'Erro ao enviar notificação', mensagem: error.message });
  }
};

/**
 * POST /emprestimos/foto - Cria empréstimo a partir da foto da capa do livro
 * Body: multipart/form-data com campo "foto" (imagem) e "pessoa" (string)
 */
const createFromFoto = async (req, res) => {
  try {
    const { pessoa } = req.body;

    if (!pessoa || !pessoa.trim()) {
      return res.status(400).json({ erro: 'Campo obrigatório: pessoa' });
    }

    if (!req.file) {
      return res.status(400).json({ erro: 'Campo obrigatório: foto (imagem do livro)' });
    }

    // Extrai texto da imagem via OCR
    let textoExtraido;
    try {
      textoExtraido = await extrairTexto(req.file.buffer);
    } catch (ocrError) {
      return res.status(422).json({ erro: 'Falha ao processar imagem com OCR', mensagem: ocrError.message });
    }

    if (!textoExtraido || !textoExtraido.trim()) {
      return res.status(422).json({ erro: 'Não foi possível extrair texto da imagem fornecida' });
    }

    // Busca todos os livros ativos e tenta encontrar o título no texto extraído
    const livros = await Book.find({ status: 1 });
    const resultado = encontrarLivroNoTexto(textoExtraido, livros);

    if (!resultado) {
      return res.status(404).json({
        erro: 'Nenhum livro do acervo foi identificado na imagem',
        textoExtraido: textoExtraido.trim(),
      });
    }

    const livro = resultado.livro;

    // Verifica disponibilidade
    const emprestimosAtivos = await Emprestimo.countDocuments({
      livro: livro._id,
      status: 'ativo',
    });

    if (emprestimosAtivos >= livro.quantidade) {
      return res.status(400).json({
        erro: 'Sem cópias disponíveis para emprestar',
        livro: { _id: livro._id, titulo: livro.titulo },
      });
    }

    const emprestimo = await Emprestimo.create({
      livro: livro._id,
      pessoa: pessoa.trim(),
    });

    await Book.findByIdAndUpdate(livro._id, { $push: { emprestimos: emprestimo._id } });

    const emprestimoPopulado = await Emprestimo.findById(emprestimo._id).populate('livro');

    return res.status(201).json(emprestimoPopulado);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ erro: 'Validação falhou', mensagens });
    }
    return res.status(500).json({ erro: 'Erro ao criar empréstimo por foto', mensagem: error.message });
  }
};

module.exports = {
  listAll,
  getById,
  create,
  createFromFoto,
  devolver,
  getByLivroId,
  remove,
  getAtrasados,
  sendNotificacoes,
};
