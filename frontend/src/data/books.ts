export type Book = {
  _id: string;
  titulo: string;
  autor: string;
  capa: string;
  descricao: string;
  ano: number;
  genero: string;
  avaliacoes: Avaliacao[];
  mediaAvaliacoes: number;
}

export type Avaliacao ={
  _id: string;
  usuario: string;
  nota: number;
  comentario: string;
  data: string;
}