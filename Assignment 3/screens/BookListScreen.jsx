import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFetchBooks } from '../hooks/useFetchBooks';
import { deleteBook } from '../api/booksApi';
import useBookStore from '../store/useBookStore';

const FILTERS = ['all', 'reading', 'finished', 'want-to-read'];

export default function BookListScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const { loading, error, retry } = useFetchBooks();
  const books = useBookStore((s) => s.books);
  const selectedFilter = useBookStore((s) => s.selectedFilter);
  const setFilter = useBookStore((s) => s.setFilter);
  const removeBook = useBookStore((s) => s.removeBook);
  const user = useBookStore((s) => s.user);
  const logout = useBookStore((s) => s.logout);

  const filtered = books.filter((b) => {
    const matchSearch =
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = selectedFilter === 'all' || b.status === selectedFilter;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id, title) => {
    Alert.alert('Delete Book', `Are you sure you want to delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteBook(id);
            removeBook(id);
          } catch {
            Alert.alert('Error', 'Failed to delete book. Please try again.');
          }
        }
      }
    ]);
  };

  const statusColor = (status) => {
    if (status === 'reading') return '#2c7be5';
    if (status === 'finished') return '#27ae60';
    return '#e67e22';
  };

  const statusIcon = (status) => {
    if (status === 'reading') return 'book';
    if (status === 'finished') return 'checkmark-circle';
    return 'bookmark';
  };

  const filterIcon = (f) => {
    if (f === 'all') return 'apps';
    if (f === 'reading') return 'book';
    if (f === 'finished') return 'checkmark-circle';
    return 'bookmark';
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookDetail', { book: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.bookIconBox}>
          <Ionicons name="book" size={22} color="#2c7be5" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.author}>by {item.author}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusColor(item.status) }]}>
          <Ionicons name={statusIcon(item.status)} size={11} color="#fff" />
          <Text style={styles.badgeText}> {item.status}</Text>
        </View>
      </View>

      {item.description ? (
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      ) : null}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditBook', { book: item })}
        >
          <Ionicons name="create-outline" size={15} color="#2c7be5" />
          <Text style={styles.editBtnText}> Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Ionicons name="trash-outline" size={15} color="#e74c3c" />
          <Text style={styles.deleteBtnText}> Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="library" size={22} color="#2c7be5" />
          <Text style={styles.welcome}> Hello, {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
          <Text style={styles.logout}> Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.search}
          placeholder="Search by title or author..."
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, selectedFilter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Ionicons
              name={filterIcon(f)}
              size={13}
              color={selectedFilter === f ? '#fff' : '#666'}
            />
            <Text style={[styles.filterText, selectedFilter === f && styles.filterTextActive]}>
              {' '}{f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2c7be5" />
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      )}

      {/* Error */}
      {error && !loading && (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={retry}>
            <Ionicons name="refresh-outline" size={16} color="#fff" />
            <Text style={styles.retryText}> Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <View style={styles.centered}>
          <Ionicons name="bookmarks-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No books found</Text>
          <Text style={styles.emptySubtext}>Add your first book using the + button</Text>
        </View>
      )}

      {/* Book List */}
      {!loading && !error && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateBook')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  welcome: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center' },
  logout: { color: '#e74c3c', fontWeight: '600' },
  searchRow: { flexDirection: 'row', alignItems: 'center', margin: 12, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  searchIcon: { marginRight: 8 },
  search: { flex: 1, padding: 12, fontSize: 14 },
  filters: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8, gap: 6 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: '#eee' },
  filterActive: { backgroundColor: '#2c7be5' },
  filterText: { fontSize: 11, color: '#666', textTransform: 'capitalize' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 12, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bookIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#eaf2ff', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  cardInfo: { flex: 1 },
  bookTitle: { fontSize: 15, fontWeight: 'bold', color: '#1a1a2e' },
  author: { fontSize: 12, color: '#888', marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  description: { fontSize: 13, color: '#888', marginBottom: 10 },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: { flex: 1, flexDirection: 'row', padding: 8, borderRadius: 8, backgroundColor: '#eaf2ff', alignItems: 'center', justifyContent: 'center' },
  editBtnText: { color: '#2c7be5', fontWeight: '600', fontSize: 13 },
  deleteBtn: { flex: 1, flexDirection: 'row', padding: 8, borderRadius: 8, backgroundColor: '#ffeaea', alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { color: '#e74c3c', fontWeight: '600', fontSize: 13 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#666' },
  errorText: { color: '#e74c3c', fontSize: 15, textAlign: 'center', marginBottom: 12, marginTop: 8 },
  retryBtn: { flexDirection: 'row', backgroundColor: '#2c7be5', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  retryText: { color: '#fff', fontWeight: '600' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 12 },
  emptySubtext: { fontSize: 13, color: '#999', marginTop: 4 },
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#2c7be5', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});