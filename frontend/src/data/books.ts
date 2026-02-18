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

// export const booksData: Book[] = [
//   {
//     id: '1',
//     titulo: 'Cem Anos de Solidão',
//     autor: 'Gabriel García Márquez',
//     capa: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
//     descricao: 'Uma obra-prima do realismo mágico que narra a história da família Buendía ao longo de várias gerações na fictícia cidade de Macondo. García Márquez tece uma narrativa épica que mistura fantasia e realidade, explorando temas universais como amor, solidão, destino e a natureza cíclica da história.',
//     ano: 1967,
//     genero: 'Ficção',
//     mediaAvaliacoes: 4.7,
//     avaliacoes: [
//       {
//         id: 'a1',
//         usuario: 'Maria Silva',
//         nota: 5,
//         comentario: 'Uma obra-prima absoluta! A forma como Márquez entrelaça realidade e fantasia é simplesmente magistral.',
//         data: '2024-01-15',
//       },
//       {
//         id: 'a2',
//         usuario: 'João Santos',
//         nota: 4,
//         comentario: 'Livro denso mas recompensador. A narrativa exige atenção mas vale cada página.',
//         data: '2024-01-20',
//       },
//     ],
//   },
//   {
//     id: '2',
//     titulo: 'O Nome da Rosa',
//     autor: 'Umberto Eco',
//     capa: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
//     descricao: 'Um romance histórico que se passa em um mosteiro beneditino no século XIV. Eco combina mistério, filosofia e semiótica em uma narrativa complexa sobre uma série de mortes misteriosas, questionando a natureza da verdade e do conhecimento.',
//     ano: 1980,
//     genero: 'Mistério',
//     mediaAvaliacoes: 4.5,
//     avaliacoes: [
//       {
//         id: 'a3',
//         usuario: 'Ana Costa',
//         nota: 5,
//         comentario: 'Fascinante mistura de história, filosofia e mistério. Eco é um gênio!',
//         data: '2024-02-01',
//       },
//     ],
//   },
//   {
//     id: '3',
//     titulo: '1984',
//     autor: 'George Orwell',
//     capa: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
//     descricao: 'Uma distopia assustadora que apresenta um futuro totalitário onde o Grande Irmão observa tudo e todos. Orwell explora temas de vigilância, propaganda e manipulação da verdade que permanecem surpreendentemente relevantes.',
//     ano: 1949,
//     genero: 'Ficção Científica',
//     mediaAvaliacoes: 4.8,
//     avaliacoes: [
//       {
//         id: 'a4',
//         usuario: 'Pedro Lima',
//         nota: 5,
//         comentario: 'Assustadoramente atual. Deveria ser leitura obrigatória.',
//         data: '2024-01-28',
//       },
//       {
//         id: 'a5',
//         usuario: 'Carla Mendes',
//         nota: 5,
//         comentario: 'Um clássico atemporal que nos faz refletir sobre liberdade e controle.',
//         data: '2024-02-03',
//       },
//     ],
//   },
//   {
//     id: '4',
//     titulo: 'Dom Casmurro',
//     autor: 'Machado de Assis',
//     capa: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
//     descricao: 'Romance clássico da literatura brasileira que conta a história de Bentinho e sua obsessão com a possível traição de Capitu. Machado de Assis cria uma narrativa ambígua que deixa ao leitor a interpretação dos fatos.',
//     ano: 1899,
//     genero: 'Romance',
//     mediaAvaliacoes: 4.3,
//     avaliacoes: [
//       {
//         id: 'a6',
//         usuario: 'Lucas Ferreira',
//         nota: 4,
//         comentario: 'A ambiguidade da narrativa é genial. Capitu traiu ou não?',
//         data: '2024-01-10',
//       },
//     ],
//   },
//   {
//     id: '5',
//     titulo: 'O Pequeno Príncipe',
//     autor: 'Antoine de Saint-Exupéry',
//     capa: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
//     descricao: 'Uma fábula poética sobre um pequeno príncipe que viaja de planeta em planeta, encontrando personagens peculiares. Sob a aparente simplicidade, esconde reflexões profundas sobre amor, amizade, perda e o sentido da vida.',
//     ano: 1943,
//     genero: 'Infantojuvenil',
//     mediaAvaliacoes: 4.9,
//     avaliacoes: [
//       {
//         id: 'a7',
//         usuario: 'Sofia Almeida',
//         nota: 5,
//         comentario: 'Cada releitura revela novas camadas. Um livro para toda a vida.',
//         data: '2024-02-05',
//       },
//       {
//         id: 'a8',
//         usuario: 'Ricardo Gomes',
//         nota: 5,
//         comentario: 'Simples e profundo ao mesmo tempo. Emocionante!',
//         data: '2024-02-07',
//       },
//     ],
//   },
//   {
//     id: '6',
//     titulo: 'Crime e Castigo',
//     autor: 'Fiódor Dostoiévski',
//     capa: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
//     descricao: 'Um profundo estudo psicológico sobre Raskólnikov, um estudante pobre que comete um assassinato e lida com as consequências morais e psicológicas de seu ato. Dostoiévski explora culpa, redenção e a natureza humana.',
//     ano: 1866,
//     genero: 'Ficção',
//     mediaAvaliacoes: 4.6,
//     avaliacoes: [],
//   },
//   {
//     id: '7',
//     titulo: 'Orgulho e Preconceito',
//     autor: 'Jane Austen',
//     capa: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
//     descricao: 'Romance clássico que acompanha Elizabeth Bennet e seu complexo relacionamento com Mr. Darcy. Austen critica com sagacidade a sociedade inglesa do século XIX enquanto tece uma história encantadora sobre amor e autodescoberta.',
//     ano: 1813,
//     genero: 'Romance',
//     mediaAvaliacoes: 4.7,
//     avaliacoes: [
//       {
//         id: 'a9',
//         usuario: 'Beatriz Rocha',
//         nota: 5,
//         comentario: 'A ironia de Austen é deliciosa. Elizabeth é uma protagonista maravilhosa!',
//         data: '2024-01-25',
//       },
//     ],
//   },
//   {
//     id: '8',
//     titulo: 'O Senhor dos Anéis',
//     autor: 'J.R.R. Tolkien',
//     capa: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
//     descricao: 'Épico de fantasia que narra a jornada de Frodo Bolseiro para destruir o Um Anel e salvar a Terra-média. Tolkien criou um universo rico e detalhado que se tornou referência para toda a fantasia moderna.',
//     ano: 1954,
//     genero: 'Fantasia',
//     mediaAvaliacoes: 4.8,
//     avaliacoes: [
//       {
//         id: 'a10',
//         usuario: 'Gabriel Torres',
//         nota: 5,
//         comentario: 'A construção de mundo mais impressionante da literatura. Obra-prima!',
//         data: '2024-02-02',
//       },
//     ],
//   },
// ];
