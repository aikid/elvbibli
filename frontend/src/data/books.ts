export type Book = {
  _id: string;
  titulo: string;
  autor: string;
  capa: string;
  descricao: string;
  ano: number;
  quantidade: number;
  genero: string;
  avaliacoes: Avaliacao[];
  emprestimos: Emprestimo[];
  mediaAvaliacoes: number;
  statusDisponibilidade: string;
}

export type Emprestimo = {
  _id: string;
  livro: string;
  pessoa: string;
}

export type Avaliacao ={
  _id: string;
  usuario: string;
  nota: number;
  comentario: string;
  data: string;
}