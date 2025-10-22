import { Tabs } from 'expo-router';
import React from 'react';
import { Home, ShoppingCart, User, Package, Shield } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';

export default function TabLayout() {
  const { hasRole } = useAuth();
  const { t } = useLocale();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('app.name'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('cart.title'),
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
        }}
      />
      {hasRole('seller') && (
        <Tabs.Screen
          name="seller"
          options={{
            title: t('seller.title'),
            tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
          }}
        />
      )}
      {hasRole('admin') && (
        <Tabs.Screen
          name="admin"
          options={{
            title: t('admin.title'),
            tabBarIcon: ({ color, size }) => <Shield size={size} color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
