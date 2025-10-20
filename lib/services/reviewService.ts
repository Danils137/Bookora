import { supabase } from '../supabase'
import type { Review, SupabaseReview } from '../../types/database'

export class ReviewService {
  // Получить все отзывы
  static async getAll() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Получить отзыв по ID
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Получить отзывы для книги
  static async getByBook(bookId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Получить отзывы покупателя
  static async getByBuyer(buyerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Получить отзывы для продавца
  static async getBySeller(sellerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformFromSupabase)
  }

  // Создать отзыв
  static async create(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([this.transformToSupabase(reviewData)])
      .select()
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Обновить отзыв
  static async update(id: string, reviewData: Partial<Omit<Review, 'id' | 'createdAt'>>) {
    const { data, error } = await supabase
      .from('reviews')
      .update(this.transformToSupabase(reviewData))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return this.transformFromSupabase(data)
  }

  // Удалить отзыв
  static async delete(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Получить статистику отзывов для книги
  static async getBookStats(bookId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('book_id', bookId)

    if (error) throw error

    if (data.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {}
      }
    }

    const totalReviews = data.length
    const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    const ratingDistribution = data.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution
    }
  }

  // Получить статистику отзывов для продавца
  static async getSellerStats(sellerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('seller_id', sellerId)

    if (error) throw error

    if (data.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {}
      }
    }

    const totalReviews = data.length
    const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    const ratingDistribution = data.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution
    }
  }

  // Проверить, оставлял ли покупатель отзыв на книгу
  static async hasUserReviewedBook(bookId: string, buyerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('book_id', bookId)
      .eq('buyer_id', buyerId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return !!data
  }

  // Преобразование из Supabase формата в наш формат
  private static transformFromSupabase(data: any): Review {
    return {
      id: data.id,
      bookId: data.book_id,
      buyerId: data.buyer_id,
      sellerId: data.seller_id,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date(data.created_at)
    }
  }

  // Преобразование из нашего формата в Supabase формат
  private static transformToSupabase(reviewData: any) {
    return {
      book_id: reviewData.bookId,
      buyer_id: reviewData.buyerId,
      seller_id: reviewData.sellerId,
      rating: reviewData.rating,
      comment: reviewData.comment
    }
  }
}
