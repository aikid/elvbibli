const { createWorker } = require('tesseract.js');

/**
 * Extrai texto de um buffer de imagem usando OCR (Tesseract).
 * Tenta português primeiro, depois inglês como fallback.
 * @param {Buffer} imagemBuffer - Buffer da imagem
 * @returns {Promise<string>} - Texto extraído
 */
const extrairTexto = async (imagemBuffer) => {
  const worker = await createWorker(['por', 'eng']);
  try {
    const { data: { text } } = await worker.recognize(imagemBuffer);
    return text;
  } finally {
    await worker.terminate();
  }
};

/**
 * Normaliza texto para comparação: minúsculas, sem acentos, sem caracteres especiais.
 * @param {string} texto
 * @returns {string}
 */
const normalizar = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Dado o texto extraído por OCR, tenta encontrar qual título de livro
 * (dentre os candidatos) melhor se encaixa no texto.
 * Retorna o livro com maior pontuação de correspondência ou null.
 * @param {string} textoOcr
 * @param {Array<{titulo: string, _id: any}>} livros
 * @returns {{ livro: object, score: number } | null}
 */
const encontrarLivroNoTexto = (textoOcr, livros) => {
  const textoNorm = normalizar(textoOcr);

  let melhor = null;
  let melhorScore = 0;

  for (const livro of livros) {
    const tituloNorm = normalizar(livro.titulo);

    // Correspondência exata do título no texto
    if (textoNorm.includes(tituloNorm)) {
      const score = tituloNorm.length;
      if (score > melhorScore) {
        melhorScore = score;
        melhor = livro;
      }
      continue;
    }

    // Correspondência por palavras: quantas palavras do título aparecem no texto
    const palavrasTitulo = tituloNorm.split(' ').filter((p) => p.length > 2);
    if (palavrasTitulo.length === 0) continue;

    const acertos = palavrasTitulo.filter((palavra) => textoNorm.includes(palavra)).length;
    const proporcao = acertos / palavrasTitulo.length;

    // Exige pelo menos 70% das palavras correspondendo
    if (proporcao >= 0.7) {
      const score = proporcao * tituloNorm.length;
      if (score > melhorScore) {
        melhorScore = score;
        melhor = livro;
      }
    }
  }

  return melhor ? { livro: melhor, score: melhorScore } : null;
};

module.exports = { extrairTexto, encontrarLivroNoTexto };
