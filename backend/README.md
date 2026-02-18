# Biblioteca Virtual - API REST

Backend em Node.js com Express e Mongoose, conectado ao MongoDB Atlas (free tier).

## Estrutura do projeto

```
src/
├── config/
│   └── database.js    # Conexão MongoDB
├── models/
│   ├── Book.js        # Modelo Livro
│   └── Avaliacao.js   # Schema de avaliação (embedado em Book)
├── controllers/
│   └── bookController.js
├── routes/
│   └── bookRoutes.js
├── app.js             # App Express (CORS, rotas, middleware)
└── server.js          # Entrada: conexão DB + listen
```

## Pré-requisitos

- Node.js 18+
- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cluster free)

## Como rodar

1. **Clone ou acesse o projeto e instale as dependências:**

   ```bash
   npm install
   ```

2. **Configure o ambiente:**

   Copie o arquivo de exemplo e preencha com sua URI do MongoDB Atlas:

   ```bash
   copy .env.example .env
   ```

   Edite o `.env` e defina:

   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@SEU_CLUSTER.mongodb.net/biblioteca?retryWrites=true&w=majority
   ```

3. **Inicie o servidor:**

   ```bash
   npm start
   ```

   Ou em modo desenvolvimento (reinicia ao alterar arquivos):

   ```bash
   npm run dev
   ```

   A API estará em `http://localhost:3000`.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/books` | Lista todos os livros |
| GET | `/books/:id` | Busca livro por id |
| POST | `/books` | Cria novo livro |
| PUT | `/books/:id` | Atualiza livro |
| DELETE | `/books/:id` | Remove livro |
| POST | `/books/:id/avaliacoes` | Adiciona avaliação ao livro (média recalculada automaticamente) |

---

## Exemplos de requisição

### Criar um livro

**POST** `http://localhost:3000/books`

**Headers:** `Content-Type: application/json`

**Body (JSON):**

```json
{
  "titulo": "O Senhor dos Anéis",
  "autor": "J. R. R. Tolkien",
  "capa": "https://exemplo.com/capa-sda.jpg",
  "descricao": "Uma jornada épica pela Terra-média.",
  "ano": 1954,
  "genero": "Fantasia",
  "quantidade": 10
}
```

Campos obrigatórios: `titulo`, `autor`, `capa`.  
Opcionais: `descricao`, `ano`, `genero`, `quantidade` (default: 0).  
`quantidade` não pode ser negativa.

---

### Adicionar avaliação a um livro

**POST** `http://localhost:3000/books/:id/avaliacoes`

Substitua `:id` pelo `_id` do livro (ex.: retornado ao criar o livro).

**Headers:** `Content-Type: application/json`

**Body (JSON):**

```json
{
  "usuario": "Maria Silva",
  "nota": 5,
  "comentario": "Livro incrível, recomendo muito!"
}
```

Campos obrigatórios: `usuario`, `nota`, `comentario`.  
`nota` deve ser entre **1 e 5**.  
Opcional: `data` (string no formato `YYYY-MM-DD`); se omitido, usa a data atual.

A média das avaliações (`mediaAvaliacoes`) é recalculada automaticamente ao salvar.

---

## Respostas

- **200** – Sucesso (GET, PUT, DELETE)
- **201** – Criado (POST livro ou POST avaliação)
- **400** – Dados inválidos ou validação falhou
- **404** – Livro não encontrado
- **500** – Erro interno do servidor

Respostas de erro seguem o formato:

```json
{
  "erro": "Descrição do erro",
  "mensagem": "Detalhe opcional"
}
```

## Tecnologias

- **Node.js** + **Express**
- **Mongoose** (MongoDB)
- **dotenv** (variáveis de ambiente)
- **cors** (requisições de outros domínios)

Código organizado, com validações básicas, try/catch e status HTTP adequados.
