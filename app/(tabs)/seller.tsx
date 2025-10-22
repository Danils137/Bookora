import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Plus, Package, Globe } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { trpc } from '@/lib/trpc';

export default function SellerScreen() {
  const { user } = useAuth();
  const { t, language, changeLanguage, formatCurrency } = useLocale();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const booksQuery = trpc.books.list.useQuery({ limit: 100 });

  const myBooks = booksQuery.data?.books.filter((book) => book.sellerId === user?.id) || [];

  if (booksQuery.isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('seller.myBooks')}</Text>
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
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{t('seller.myBooks')}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#007AFF" />
          </TouchableOpacity>
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

      {myBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Package size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>No books listed yet</Text>
          <Text style={styles.emptySubtext}>Start by adding your first book</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.buttonText}>Add Book</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myBooks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.bookCard}>
              <Image source={{ uri: item.imageUrl }} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Stock</Text>
                    <Text style={styles.statValue}>{item.stock}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Price</Text>
                    <Text style={styles.statValue}>{formatCurrency(item.price)}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
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
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#000',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
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
  bookCard: {
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
  bookInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
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
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#007AFF',
  },
});
