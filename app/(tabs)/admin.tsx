import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Users, BookOpen, ShoppingBag, DollarSign } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { users } from '@/lib/mock-db';

export default function AdminScreen() {
  const booksQuery = trpc.books.list.useQuery({ limit: 1000 });
  const ordersQuery = trpc.orders.list.useQuery({});

  if (booksQuery.isLoading || ordersQuery.isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  const totalRevenue = ordersQuery.data?.orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  ) || 0;

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: users.length.toString(),
      color: '#007AFF',
    },
    {
      icon: BookOpen,
      label: 'Total Books',
      value: (booksQuery.data?.total || 0).toString(),
      color: '#34C759',
    },
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: (ordersQuery.data?.orders.length || 0).toString(),
      color: '#5856D6',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      color: '#FF9500',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                  <Icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Breakdown</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Buyers</Text>
            <Text style={styles.infoValue}>
              {users.filter((u) => u.role === 'buyer').length}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sellers</Text>
            <Text style={styles.infoValue}>
              {users.filter((u) => u.role === 'seller').length}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Admins</Text>
            <Text style={styles.infoValue}>
              {users.filter((u) => u.role === 'admin').length}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pending</Text>
            <Text style={styles.infoValue}>
              {ordersQuery.data?.orders.filter((o) => o.status === 'pending').length || 0}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Processing</Text>
            <Text style={styles.infoValue}>
              {ordersQuery.data?.orders.filter((o) => o.status === 'processing').length || 0}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shipped</Text>
            <Text style={styles.infoValue}>
              {ordersQuery.data?.orders.filter((o) => o.status === 'shipped').length || 0}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Delivered</Text>
            <Text style={styles.infoValue}>
              {ordersQuery.data?.orders.filter((o) => o.status === 'delivered').length || 0}
            </Text>
          </View>
        </View>
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#000',
  },
});
