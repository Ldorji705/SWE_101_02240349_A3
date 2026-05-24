import { useState, useEffect } from 'react';
import { getBooks } from '../api/booksApi';
import { getCategories } from '../api/categoriesApi';
import useBookStore from '../store/useBookStore';

export const useFetchBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setBooks = useBookStore((s) => s.setBooks);
  const setCategories = useBookStore((s) => s.setCategories);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [booksRes, catsRes] = await Promise.all([getBooks(), getCategories()]);
      setBooks(booksRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);
  return { loading, error, retry: fetchAll };
};