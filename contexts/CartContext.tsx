import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '@/types/database';

export const [CartProvider, useCart] = createContextHook(() => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = useCallback(async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCart = useCallback(async (newItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error('Error saving cart:', error);
      throw error;
    }
  }, []);

  const addItem = useCallback(async (bookId: string, quantity: number = 1) => {
    const existingItem = items.find(item => item.bookId === bookId);

    if (existingItem) {
      const newItems = items.map(item =>
        item.bookId === bookId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      await saveCart(newItems);
    } else {
      const newItems = [...items, { bookId, quantity }];
      await saveCart(newItems);
    }
  }, [items, saveCart]);

  const removeItem = useCallback(async (bookId: string) => {
    const newItems = items.filter(item => item.bookId !== bookId);
    await saveCart(newItems);
  }, [items, saveCart]);

  const updateQuantity = useCallback(async (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(bookId);
      return;
    }

    const newItems = items.map(item =>
      item.bookId === bookId ? { ...item, quantity } : item
    );
    await saveCart(newItems);
  }, [items, removeItem, saveCart]);

  const clearCart = useCallback(async () => {
    await saveCart([]);
  }, [saveCart]);

  const getItemCount = useCallback((): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  return useMemo(() => ({
    items,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
  }), [items, isLoading, addItem, removeItem, updateQuantity, clearCart, getItemCount]);
});
