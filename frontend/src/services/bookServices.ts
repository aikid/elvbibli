import api from "./api";

export const getBooks = async () => {
  const response = await api.get("/books");
  return response.data;
};

export const getBookById = async (id: string) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (data: any) => {
  const response = await api.post("/books", data);
  return response.data;
};

export const addAvaliacao = async (bookId: string, data: any) => {
  const response = await api.post(`/books/${bookId}/avaliacoes`, data);
  return response.data;
};
