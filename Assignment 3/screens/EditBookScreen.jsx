import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateBook } from '../api/booksApi';
import useBookStore from '../store/useBookStore';
import { useForm } from '../hooks/useForm';

const STATUSES = ['reading', 'finished', 'want-to-read'];

const statusIcon = (s) => {
  if (s === 'reading') return 'book';
  if (s === 'finished') return 'checkmark-circle';
  return 'bookmark';
};

export default function EditBookScreen({ route, navigation }) {
  const { book } = route.params;
  const [loading, setLoading] = useState(false);

  const { values, errors, setErrors, handleChange } = useForm({
    title: book.title || '',
    author: book.author || '',
    description: book.description || '',
    status: book.status || 'want-to-read',
    categoryId: String(book.categoryId) || '',
  });

  const updateBookInStore = useBookStore((s) => s.updateBook);
  const categories = useBookStore((s) => s.categories);

  const validate = () => {
    const newErrors = {};
    if (!values.title.trim()) newErrors.title = 'Title is required';
    else if (values.title.length < 2) newErrors.title = 'Title too short';
    if (!values.author.trim()) newErrors.author = 'Author is required';
    if (!values.categoryId || values.categoryId === '')
      newErrors.categoryId = 'Please select a category';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await updateBook(book.id, values);
      updateBookInStore(book.id, res.data);
      Alert.alert('Success', 'Book updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch {
      Alert.alert('Error', 'Failed to update book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Heading */}
      <View style={styles.headingRow}>
        <Ionicons name="create" size={28} color="#27ae60" />
        <Text style={styles.heading}> Edit Book</Text>
      </View>

      {/* Title */}
      <Text style={styles.label}>Title *</Text>
      <View style={[styles.inputRow, errors.title && styles.inputError]}>
        <Ionicons name="text" size={16} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="e.g. The Great Gatsby"
          value={values.title}
          onChangeText={(v) => handleChange('title', v)}
        />
      </View>
      {errors.title && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color="#e74c3c" />
          <Text style={styles.errorText}> {errors.title}</Text>
        </View>
      )}

      {/* Author */}
      <Text style={styles.label}>Author *</Text>
      <View style={[styles.inputRow, errors.author && styles.inputError]}>
        <Ionicons name="person-outline" size={16} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="e.g. F. Scott Fitzgerald"
          value={values.author}
          onChangeText={(v) => handleChange('author', v)}
        />
      </View>
      {errors.author && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color="#e74c3c" />
          <Text style={styles.errorText}> {errors.author}</Text>
        </View>
      )}

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <View style={styles.textAreaRow}>
        <Ionicons name="document-text-outline" size={16} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.textArea}
          placeholder="Short description of the book..."
          value={values.description}
          onChangeText={(v) => handleChange('description', v)}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Status */}
      <Text style={styles.label}>Reading Status *</Text>
      <View style={styles.optionRow}>
        {STATUSES.map((s, index) => (
          <TouchableOpacity
            key={`status-${index}-${s}`}
            style={[styles.optionBtn, values.status === s && styles.optionActive]}
            onPress={() => handleChange('status', s)}
          >
            <Ionicons
              name={statusIcon(s)}
              size={15}
              color={values.status === s ? '#fff' : '#666'}
            />
            <Text style={[styles.optionText, values.status === s && styles.optionTextActive]}>
              {' '}{s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category */}
      <Text style={styles.label}>Category *</Text>
      {categories.length === 0 ? (
        <View style={styles.errorRow}>
          <Ionicons name="warning-outline" size={14} color="#e67e22" />
          <Text style={styles.noCat}> No categories found</Text>
        </View>
      ) : (
        <View style={styles.optionRow}>
          {categories.map((c, index) => (
            <TouchableOpacity
              key={`cat-${index}-${c.id}`}
              style={[styles.catBtn, values.categoryId == c.id && styles.catActive]}
              onPress={() => handleChange('categoryId', String(c.id))}
            >
              <Ionicons
                name="folder-outline"
                size={14}
                color={values.categoryId == c.id ? '#fff' : '#666'}
              />
              <Text style={[styles.catText, values.categoryId == c.id && styles.catTextActive]}>
                {' '}{c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {errors.categoryId && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color="#e74c3c" />
          <Text style={styles.errorText}> {errors.categoryId}</Text>
        </View>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={styles.submitText}> Save Changes</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close-circle-outline" size={18} color="#999" />
        <Text style={styles.cancelText}> Cancel</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 24, paddingBottom: 48 },
  headingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 4 },
  inputIcon: { paddingLeft: 12 },
  input: { flex: 1, padding: 12, fontSize: 15 },
  inputError: { borderColor: '#e74c3c' },
  textAreaRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 4 },
  textArea: { flex: 1, padding: 12, fontSize: 15, height: 100, textAlignVertical: 'top' },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  errorText: { color: '#e74c3c', fontSize: 12 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#eee' },
  optionActive: { backgroundColor: '#2c7be5' },
  optionText: { fontSize: 13, color: '#666', textTransform: 'capitalize' },
  optionTextActive: { color: '#fff', fontWeight: '600' },
  catBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#eee' },
  catActive: { backgroundColor: '#27ae60' },
  catText: { fontSize: 13, color: '#666' },
  catTextActive: { color: '#fff', fontWeight: '600' },
  noCat: { color: '#e67e22', fontSize: 13 },
  submitBtn: { flexDirection: 'row', backgroundColor: '#27ae60', borderRadius: 10, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { flexDirection: 'row', padding: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  cancelText: { color: '#999', fontSize: 15 },
});