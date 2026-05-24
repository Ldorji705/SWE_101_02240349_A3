import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useBookStore = create((set, get) => ({
  // State
  books: [],
  categories: [],
  user: null,
  authToken: null,
  selectedFilter: 'all',

  // Book actions
  setBooks: (books) => set({ books }),
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  updateBook: (id, updated) =>
    set((state) => ({
      books: state.books.map((b) => (b.id === id ? updated : b)),
    })),
  removeBook: (id) =>
    set((state) => ({ books: state.books.filter((b) => b.id !== id) })),

  // Category actions
  setCategories: (categories) => set({ categories }),

  // Filter
  setFilter: async (filter) => {
    set({ selectedFilter: filter });
    await AsyncStorage.setItem('lastFilter', filter); // persist filter
  },

  // Auth actions
  login: async (token, user) => {
    set({ authToken: token, user });
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },
  logout: async () => {
    set({ authToken: null, user: null });
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  // Rehydrate on app start
  rehydrate: async () => {
    const token = await AsyncStorage.getItem('authToken');
    const userStr = await AsyncStorage.getItem('user');
    const filter = await AsyncStorage.getItem('lastFilter');
    set({
      authToken: token || null,
      user: userStr ? JSON.parse(userStr) : null,
      selectedFilter: filter || 'all',
    });
  },
}));

export default useBookStore;