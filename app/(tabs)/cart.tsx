import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Trash2, Plus, Minus, Globe } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import { useLocale } from '@/contexts/LocaleContext';
import { trpc } from '@/lib/trpc';
import { router } from 'expo-router';

export default function CartScreen() {
  const { items, removeItem, updateQuantity } = useCart();
  const { t, formatCurrency, language, changeLanguage } = useLocale();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const booksQuery = trpc.books.list.useQuery({ limit: 100 });

  const cartBooks = items
    .map((item) => ({
      ...item,
      book: booksQuery.data?.books.find((b) => b.id === item.bookId),
    }))
    .filter((item) => item.book);

  const total = cartBooks.reduce(
    (sum, item) => sum + (item.book?.price || 0) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('cart.title')}</Text>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <Globe size={20} color="#007AFF" />
            <Text style={styles.languageButtonText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
          {showLanguageMenu && (
            <View style={styles.languageMenu}>
              {(['en', 'ru', 'lv'] as const).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageMenuItem,
                    language === lang && styles.languageMenuItemActive,
                  ]}
                  onPress={() => {
                    changeLanguage(lang);
                    setShowLanguageMenu(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageMenuItemText,
                      language === lang && styles.languageMenuItemTextActive,
                    ]}
                  >
                    {t(`language.${lang}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('cart.empty')}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.buttonText}>{t('cart.continueShopping')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('cart.title')}</Text>
          <Text style={styles.itemCount}>{items.length} items</Text>
        </View>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguageMenu(!showLanguageMenu)}
        >
          <Globe size={20} color="#007AFF" />
          <Text style={styles.languageButtonText}>{language.toUpperCase()}</Text>
        </TouchableOpacity>
        {showLanguageMenu && (
          <View style={styles.languageMenu}>
            {(['en', 'ru', 'lv'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageMenuItem,
                  language === lang && styles.languageMenuItemActive,
                ]}
                onPress={() => {
                  changeLanguage(lang);
                  setShowLanguageMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.languageMenuItemText,
                    language === lang && styles.languageMenuItemTextActive,
                  ]}
                >
                  {t(`language.${lang}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <FlatList
        data={cartBooks}
        keyExtractor={(item) => item.bookId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.book?.imageUrl }} style={styles.bookImage} />
            <View style={styles.bookDetails}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {item.book?.title}
              </Text>
              <Text style={styles.bookAuthor}>{item.book?.author}</Text>
              <Text style={styles.bookPrice}>{formatCurrency(item.book?.price || 0)}</Text>
            </View>
            <View style={styles.actions}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.bookId, item.quantity - 1)}
                >
                  <Minus size={16} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.bookId, item.quantity + 1)}
                >
                  <Plus size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeItem(item.bookId)}
              >
                <Trash2 size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{t('cart.total')}</Text>
          <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutButtonText}>{t('cart.checkout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#007AFF',
  },
  languageMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 150,
    overflow: 'hidden',
    zIndex: 1000,
  },
  languageMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  languageMenuItemActive: {
    backgroundColor: '#F0F8FF',
  },
  languageMenuItemText: {
    fontSize: 16,
    color: '#000',
  },
  languageMenuItemTextActive: {
    color: '#007AFF',
    fontWeight: '600' as const,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
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
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
  },
  bookDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#007AFF',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600' as const,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#000',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as const,
  },
});
