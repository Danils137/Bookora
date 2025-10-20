import { supabase } from '../supabase'
import type { Order, OrderItem, SupabaseOrder, SupabaseOrderItem } from '../../types/database'

export class OrderService {
  // Получить все заказы
  static async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Получить заказ по ID
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Получить заказы покупателя
  static async getByBuyer(buyerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Получить заказы для продавца (по книгам продавца)
  static async getBySeller(sellerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items!inner (
          *,
          books!inner (seller_id)
        )
      `)
      .eq('books.seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Создать заказ
  static async create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    // Начинаем транзакцию
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([this.transformToSupabase(orderData)])
      .select()
      .single()

    if (orderError) throw orderError

    // Создаем элементы заказа
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      book_id: item.bookId,
      seller_id: item.sellerId,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      // В случае ошибки удаляем созданный заказ
      await supabase.from('orders').delete().eq('id', order.id)
      throw itemsError
    }

    return this.getById(order.id)
  }

  // Обновить статус заказа
  static async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        order_items (*)
      `)
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Обновить заказ
  static async update(id: string, orderData: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>) {
    const { data, error } = await supabase
      .from('orders')
      .update(this.transformToSupabase(orderData))
      .eq('id', id)
      .select(`
        *,
        order_items (*)
      `)
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Удалить заказ
  static async delete(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Получить статистику заказов
  static async getStats() {
    const { data, error } = await supabase
      .from('orders')
      .select('status, total_amount')

    if (error) throw error

    const totalOrders = data.length
    const totalRevenue = data
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + Number(order.total_amount), 0)

    const statusCounts = data.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalOrders,
      totalRevenue,
      statusCounts,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    }
  }

  // Получить заказы по статусу
  static async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Преобразование из Supabase формата в наш формат
  private static transformFromSupabase(data: any): Order {
    return {
      id: data.id,
      buyerId: data.buyer_id,
      items: data.order_items?.map((item: any) => ({
        bookId: item.book_id,
        sellerId: item.seller_id,
        quantity: item.quantity,
        price: Number(item.price)
      })) || [],
      totalAmount: Number(data.total_amount),
      status: data.status,
      shippingAddress: data.shipping_address,
      paymentId: data.payment_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    }
  }

  // Преобразование из нашего формата в Supabase формат
  private static transformToSupabase(orderData: any) {
    return {
      buyer_id: orderData.buyerId,
      total_amount: orderData.totalAmount,
      status: orderData.status,
      shipping_address: orderData.shippingAddress,
      payment_id: orderData.paymentId
    }
  }
}
