import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Search, SlidersHorizontal, Globe } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();
  const { t, formatCurrency, language, changeLanguage } = useLocale();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  });

  const booksQuery = trpc.books.list.useQuery({
    search: search || undefined,
    genre: filters.genre || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    limit: 20,
  });

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>{t('welcome')}</Text>
          <Text style={styles.subtitle}>{t('login.title')}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>{t('login.button')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('app.name')}</Text>
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

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search.placeholder')}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder={t('filter.genre')}
            value={filters.genre}
            onChangeText={(text) => setFilters({ ...filters, genre: text })}
          />
          <View style={styles.priceFilters}>
            <TextInput
              style={[styles.filterInput, styles.priceInput]}
              placeholder={t('filter.minPrice')}
              keyboardType="numeric"
              value={filters.minPrice?.toString() || ''}
              onChangeText={(text) =>
                setFilters({ ...filters, minPrice: text ? Number(text) : undefined })
              }
            />
            <TextInput
              style={[styles.filterInput, styles.priceInput]}
              placeholder={t('filter.maxPrice')}
              keyboardType="numeric"
              value={filters.maxPrice?.toString() || ''}
              onChangeText={(text) =>
                setFilters({ ...filters, maxPrice: text ? Number(text) : undefined })
              }
            />
          </View>
        </View>
      )}

      {booksQuery.isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : booksQuery.error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{t('error.loading')}</Text>
        </View>
      ) : (
        <FlatList
          data={booksQuery.data?.books}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookCard}
              onPress={() => router.push(`/book/${item.id}`)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>
                  {item.author}
                </Text>
                <Text style={styles.bookPrice}>{formatCurrency(item.price)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: 12,
  },
  filterInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  priceFilters: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  listContent: {
    padding: 12,
  },
  bookCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E5E5',
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#007AFF',
  },
});
