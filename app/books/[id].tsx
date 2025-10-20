import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ShoppingCart, ArrowLeft } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/contexts/CartContext';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const bookQuery = trpc.books.get.useQuery({ id: id! });

  const handleAddToCart = async () => {
    await addItem(id!, quantity);
    router.push('/(tabs)/cart');
  };

  if (bookQuery.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (bookQuery.error || !bookQuery.data?.book) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Book not found</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const book = bookQuery.data.book;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: book.imageUrl }} style={styles.bookImage} />

        <View style={styles.detailsContainer}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Publisher</Text>
              <Text style={styles.infoValue}>{book.publisher}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Year</Text>
              <Text style={styles.infoValue}>{book.publicationYear}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Pages</Text>
              <Text style={styles.infoValue}>{book.pages}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Language</Text>
              <Text style={styles.infoValue}>{book.language}</Text>
            </View>
          </View>

          <View style={styles.genreTag}>
            <Text style={styles.genreText}>{book.genre}</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{book.description}</Text>
          </View>

          <View style={styles.isbnContainer}>
            <Text style={styles.isbnLabel}>ISBN:</Text>
            <Text style={styles.isbnValue}>{book.isbn}</Text>
          </View>

          <View style={styles.stockContainer}>
            <Text style={styles.stockText}>
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>${book.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addToCartButton, book.stock === 0 && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={book.stock === 0}
        >
          <ShoppingCart size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  content: {
    paddingBottom: 100,
  },
  bookImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#E5E5E5',
  },
  detailsContainer: {
    padding: 20,
  },
  bookTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
  },
  genreTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  isbnContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  isbnLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  isbnValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500' as const,
  },
  stockContainer: {
    marginTop: 8,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#34C759',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: 16,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#007AFF',
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
