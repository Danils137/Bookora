import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc';

export default function OrdersScreen() {
  const { user } = useAuth();
  const ordersQuery = trpc.orders.list.useQuery({ buyerId: user!.id });

  if (ordersQuery.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'My Orders', headerBackTitle: 'Back' }} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!ordersQuery.data?.orders.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'My Orders', headerBackTitle: 'Back' }} />
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'My Orders', headerBackTitle: 'Back' }} />
      <FlatList
        data={ordersQuery.data.orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>

            <View style={styles.itemsContainer}>
              {item.items.map((orderItem, index) => (
                <Text key={index} style={styles.itemText}>
                  {orderItem.book?.title} x{orderItem.quantity}
                </Text>
              ))}
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'pending':
      return { backgroundColor: '#FF9500' };
    case 'processing':
      return { backgroundColor: '#007AFF' };
    case 'shipped':
      return { backgroundColor: '#5856D6' };
    case 'delivered':
      return { backgroundColor: '#34C759' };
    case 'cancelled':
      return { backgroundColor: '#FF3B30' };
    default:
      return { backgroundColor: '#8E8E93' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600' as const,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#007AFF',
  },
});
