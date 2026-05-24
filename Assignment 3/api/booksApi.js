import axiosClient from './axiosClient';

export const getBooks = () => axiosClient.get('/books');
export const getBookById = (id) => axiosClient.get(`/books/${id}`);
export const createBook = (data) => axiosClient.post('/books', data);
export const updateBook = (id, data) => axiosClient.put(`/books/${id}`, data);
export const deleteBook = (id) => axiosClient.delete(`/books/${id}`);