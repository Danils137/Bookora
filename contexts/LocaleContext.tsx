import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'ru' | 'lv';

export type Translations = {
  [key: string]: string;
};

const translations: Record<Language, Translations> = {
  en: {
    'app.name': 'Bookora',
    'welcome': 'Welcome to Bookora',
    'login.title': 'Please login to continue',
    'login.button': 'Login',
    'search.placeholder': 'Search books, authors...',
    'filter.genre': 'Genre',
    'filter.minPrice': 'Min Price',
    'filter.maxPrice': 'Max Price',
    'error.loading': 'Error loading books',
    'book.price': 'Price',
    'book.addToCart': 'Add to Cart',
    'book.inStock': 'in stock',
    'book.outOfStock': 'Out of stock',
    'book.description': 'Description',
    'book.publisher': 'Publisher',
    'book.year': 'Year',
    'book.pages': 'Pages',
    'book.language': 'Language',
    'book.isbn': 'ISBN',
    'book.notFound': 'Book not found',
    'book.goBack': 'Go Back',
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.continueShopping': 'Continue Shopping',
    'profile.title': 'Profile',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.role': 'Role',
    'profile.logout': 'Logout',
    'profile.myOrders': 'My Orders',
    'profile.settings': 'Settings',
    'seller.title': 'Seller Dashboard',
    'seller.addBook': 'Add Book',
    'seller.myBooks': 'My Books',
    'seller.orders': 'Orders',
    'seller.analytics': 'Analytics',
    'admin.title': 'Admin Dashboard',
    'admin.users': 'Users',
    'admin.books': 'Books',
    'admin.orders': 'Orders',
    'admin.statistics': 'Statistics',
    'order.status.pending': 'Pending',
    'order.status.processing': 'Processing',
    'order.status.shipped': 'Shipped',
    'order.status.delivered': 'Delivered',
    'order.status.cancelled': 'Cancelled',
    'checkout.title': 'Checkout',
    'checkout.shippingAddress': 'Shipping Address',
    'checkout.placeOrder': 'Place Order',
    'language.select': 'Select Language',
    'language.en': 'English',
    'language.ru': 'Русский',
    'language.lv': 'Latviešu',
  },
  ru: {
    'app.name': 'Bookora',
    'welcome': 'Добро пожаловать в Bookora',
    'login.title': 'Пожалуйста, войдите, чтобы продолжить',
    'login.button': 'Войти',
    'search.placeholder': 'Поиск книг, авторов...',
    'filter.genre': 'Жанр',
    'filter.minPrice': 'Мин. цена',
    'filter.maxPrice': 'Макс. цена',
    'error.loading': 'Ошибка загрузки книг',
    'book.price': 'Цена',
    'book.addToCart': 'В корзину',
    'book.inStock': 'в наличии',
    'book.outOfStock': 'Нет в наличии',
    'book.description': 'Описание',
    'book.publisher': 'Издательство',
    'book.year': 'Год',
    'book.pages': 'Страниц',
    'book.language': 'Язык',
    'book.isbn': 'ISBN',
    'book.notFound': 'Книга не найдена',
    'book.goBack': 'Назад',
    'cart.title': 'Корзина',
    'cart.empty': 'Ваша корзина пуста',
    'cart.total': 'Итого',
    'cart.checkout': 'Оформить заказ',
    'cart.continueShopping': 'Продолжить покупки',
    'profile.title': 'Профиль',
    'profile.name': 'Имя',
    'profile.email': 'Электронная почта',
    'profile.role': 'Роль',
    'profile.logout': 'Выйти',
    'profile.myOrders': 'Мои заказы',
    'profile.settings': 'Настройки',
    'seller.title': 'Панель продавца',
    'seller.addBook': 'Добавить книгу',
    'seller.myBooks': 'Мои книги',
    'seller.orders': 'Заказы',
    'seller.analytics': 'Аналитика',
    'admin.title': 'Панель администратора',
    'admin.users': 'Пользователи',
    'admin.books': 'Книги',
    'admin.orders': 'Заказы',
    'admin.statistics': 'Статистика',
    'order.status.pending': 'Ожидает',
    'order.status.processing': 'Обрабатывается',
    'order.status.shipped': 'Отправлен',
    'order.status.delivered': 'Доставлен',
    'order.status.cancelled': 'Отменен',
    'checkout.title': 'Оформление заказа',
    'checkout.shippingAddress': 'Адрес доставки',
    'checkout.placeOrder': 'Разместить заказ',
    'language.select': 'Выберите язык',
    'language.en': 'English',
    'language.ru': 'Русский',
    'language.lv': 'Latviešu',
  },
  lv: {
    'app.name': 'Bookora',
    'welcome': 'Laipni lūdzam Bookora',
    'login.title': 'Lūdzu, ielogojieties, lai turpinātu',
    'login.button': 'Ielogoties',
    'search.placeholder': 'Meklēt grāmatas, autorus...',
    'filter.genre': 'Žanrs',
    'filter.minPrice': 'Min. cena',
    'filter.maxPrice': 'Maks. cena',
    'error.loading': 'Kļūda, ielādējot grāmatas',
    'book.price': 'Cena',
    'book.addToCart': 'Pievienot grozam',
    'book.inStock': 'noliktavā',
    'book.outOfStock': 'Nav noliktavā',
    'book.description': 'Apraksts',
    'book.publisher': 'Izdevējs',
    'book.year': 'Gads',
    'book.pages': 'Lappuses',
    'book.language': 'Valoda',
    'book.isbn': 'ISBN',
    'book.notFound': 'Grāmata nav atrasta',
    'book.goBack': 'Atpakaļ',
    'cart.title': 'Iepirkumu grozs',
    'cart.empty': 'Jūsu grozs ir tukšs',
    'cart.total': 'Kopā',
    'cart.checkout': 'Pasūtīt',
    'cart.continueShopping': 'Turpināt iepirkties',
    'profile.title': 'Profils',
    'profile.name': 'Vārds',
    'profile.email': 'E-pasts',
    'profile.role': 'Loma',
    'profile.logout': 'Izlogoties',
    'profile.myOrders': 'Mani pasūtījumi',
    'profile.settings': 'Iestatījumi',
    'seller.title': 'Pārdevēja panelis',
    'seller.addBook': 'Pievienot grāmatu',
    'seller.myBooks': 'Manas grāmatas',
    'seller.orders': 'Pasūtījumi',
    'seller.analytics': 'Analītika',
    'admin.title': 'Administratora panelis',
    'admin.users': 'Lietotāji',
    'admin.books': 'Grāmatas',
    'admin.orders': 'Pasūtījumi',
    'admin.statistics': 'Statistika',
    'order.status.pending': 'Gaida',
    'order.status.processing': 'Apstrādā',
    'order.status.shipped': 'Nosūtīts',
    'order.status.delivered': 'Piegādāts',
    'order.status.cancelled': 'Atcelts',
    'checkout.title': 'Pasūtījuma noformēšana',
    'checkout.shippingAddress': 'Piegādes adrese',
    'checkout.placeOrder': 'Veikt pasūtījumu',
    'language.select': 'Izvēlieties valodu',
    'language.en': 'English',
    'language.ru': 'Русский',
    'language.lv': 'Latviešu',
  },
};

export const [LocaleProvider, useLocale] = createContextHook(() => {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  const loadLanguage = useCallback(async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ru' || savedLanguage === 'lv')) {
        setLanguage(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  const changeLanguage = useCallback(async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem('language', newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const formatCurrency = useCallback((amount: number): string => {
    return `€${amount.toFixed(2)}`;
  }, []);

  return useMemo(() => ({
    language,
    changeLanguage,
    t,
    formatCurrency,
    isLoading,
  }), [language, changeLanguage, t, formatCurrency, isLoading]);
});
