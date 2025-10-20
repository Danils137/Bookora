import { supabase } from '../supabase'
import type { Book, SupabaseBook } from '../../types/database'

export class BookService {
  // Получить все книги
  static async getAll() {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Получить книгу по ID
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Получить книги по продавцу
  static async getBySeller(sellerId: string) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Получить книги по жанру
  static async getByGenre(genre: string) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('genre', genre)
      .order('title')

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Поиск книг по названию или автору
  static async search(query: string) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
      .order('title')

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Создать книгу
  static async create(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('books')
      .insert([this.transformToSupabase(bookData)])
      .select()
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Обновить книгу
  static async update(id: string, bookData: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>) {
    const { data, error } = await supabase
      .from('books')
      .update(this.transformToSupabase(bookData))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Удалить книгу
  static async delete(id: string) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Обновить количество книг в наличии
  static async updateStock(id: string, newStock: number) {
    const { data, error } = await supabase
      .from('books')
      .update({ stock: newStock })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Получить популярные жанры
  static async getPopularGenres(limit = 10) {
    const { data, error } = await supabase
      .from('books')
      .select('genre')
      .not('genre', 'is', null)

    if (error) throw error

    const genreCounts = data.reduce((acc: Record<string, number>, book: any) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([genre]) => genre)
  }

  // Получить статистику по книгам продавца
  static async getSellerStats(sellerId: string) {
    const { data, error } = await supabase
      .from('books')
      .select('id, price, stock')
      .eq('seller_id', sellerId)

    if (error) throw error

    const totalBooks = data.length
    const totalValue = data.reduce((sum, book) => sum + (book.price * book.stock), 0)
    const availableBooks = data.filter(book => book.stock > 0).length

    return {
      totalBooks,
      totalValue,
      availableBooks,
      outOfStock: totalBooks - availableBooks
    }
  }

  // Преобразование из Supabase формата в наш формат
  private static transformFromSupabase(data: any): Book {
    return {
      id: data.id,
      sellerId: data.seller_id,
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      description: data.description,
      genre: data.genre,
      publisher: data.publisher,
      price: Number(data.price),
      stock: data.stock,
      imageUrl: data.image_url,
      publicationYear: data.publication_year,
      language: data.language,
      pages: data.pages,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    }
  }

  // Преобразование из нашего формата в Supabase формат
  private static transformToSupabase(bookData: any) {
    return {
      seller_id: bookData.sellerId,
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      description: bookData.description,
      genre: bookData.genre,
      publisher: bookData.publisher,
      price: bookData.price,
      stock: bookData.stock,
      image_url: bookData.imageUrl,
      publication_year: bookData.publicationYear,
      language: bookData.language,
      pages: bookData.pages
    }
  }
}
