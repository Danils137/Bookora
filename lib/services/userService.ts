import { supabase } from '../supabase'
import type { User, SupabaseUser } from '../../types/database'

export class UserService {
  // Получить всех пользователей
  static async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Получить пользователя по ID
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Получить пользователя по email
  static async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Создать пользователя
  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([this.transformToSupabase(userData)])
      .select()
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Обновить пользователя
  static async update(id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) {
    const { data, error } = await supabase
      .from('users')
      .update(this.transformToSupabase(userData))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Удалить пользователя
  static async delete(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Получить продавцов
  static async getSellers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'seller')
      .eq('status', 'active')
      .order('name')

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Получить покупателей
  static async getBuyers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'buyer')
      .eq('status', 'active')
      .order('name')

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Преобразование из Supabase формата в наш формат
  private static transformFromSupabase(data: any): User {
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      status: data.status,
      companyName: data.company_name || undefined,
      companyVerified: data.company_verified || false,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    }
  }

  // Преобразование из нашего формата в Supabase формат
  private static transformToSupabase(userData: any) {
    return {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role,
      status: userData.status,
      company_name: userData.companyName || null,
      company_verified: userData.companyVerified || false
    }
  }
}
