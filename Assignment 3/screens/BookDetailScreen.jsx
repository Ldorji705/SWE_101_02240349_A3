import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteBook } from '../api/booksApi';
import useBookStore from '../store/useBookStore';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const removeBook = useBookStore((s) => s.removeBook);
  const categories = useBookStore((s) => s.categories);

  const category = categories.find((c) => c.id === book.categoryId);

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

  const handleDelete = () => {
    Alert.alert('Delete Book', `Are you sure you want to delete "${book.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteBook(book.id);
            removeBook(book.id);
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'Failed to delete. Please try again.');
          }
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Book Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="book" size={56} color="#2c7be5" />
      </View>

      {/* Title & Author */}
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>by {book.author}</Text>

      {/* Status Badge */}
      <View style={[styles.badge, { backgroundColor: statusColor(book.status) }]}>
        <Ionicons name={statusIcon(book.status)} size={13} color="#fff" />
        <Text style={styles.badgeText}> {book.status}</Text>
      </View>

      {/* Details Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="folder-outline" size={18} color="#666" />
            <Text style={styles.rowLabel}> Category</Text>
          </View>
          <Text style={styles.rowValue}>{category?.name || 'Uncategorized'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.rowLabel}> Added</Text>
          </View>
          <Text style={styles.rowValue}>
            {book.createdAt ? new Date(book.createdAt).toDateString() : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Description */}
      {book.description ? (
        <View style={styles.descCard}>
          <View style={styles.descHeader}>
            <Ionicons name="document-text-outline" size={16} color="#999" />
            <Text style={styles.descLabel}> Description</Text>
          </View>
          <Text style={styles.descText}>{book.description}</Text>
        </View>
      ) : null}

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate('EditBook', { book })}
      >
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editBtnText}> Edit Book</Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        <Text style={styles.deleteBtnText}> Delete Book</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 24, alignItems: 'center' },
  iconContainer: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#eaf2ff', justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e', textAlign: 'center', marginBottom: 6 },
  author: { fontSize: 16, color: '#666', marginBottom: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 24 },
  badgeText: { color: '#fff', fontWeight: '600', textTransform: 'capitalize' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, width: '100%', marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { fontSize: 14, color: '#666' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  divider: { height: 1, backgroundColor: '#f0f0f0' },
  descCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, width: '100%', marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6 },
  descHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  descLabel: { fontSize: 13, fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: 1 },
  descText: { fontSize: 15, color: '#333', lineHeight: 22 },
  editBtn: { flexDirection: 'row', backgroundColor: '#2c7be5', borderRadius: 10, padding: 14, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { flexDirection: 'row', backgroundColor: '#ffeaea', borderRadius: 10, padding: 14, width: '100%', alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { color: '#e74c3c', fontSize: 16, fontWeight: 'bold' },
});