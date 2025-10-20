import { users, books, orders, reviews } from './mock-db'
import { UserService } from './services/userService'
import { BookService } from './services/bookService'
import { OrderService } from './services/orderService'
import { ReviewService } from './services/reviewService'
import { supabase } from './supabase'

export async function migrateData() {
  console.log('Начинаем миграцию данных в Supabase...')

  try {
    // Миграция пользователей
    console.log('Мигрируем пользователей...')
    for (const user of users) {
      try {
        await UserService.create({
          email: user.email,
          password: user.password,
          name: user.name,
          role: user.role,
          status: user.status,
          companyName: user.companyName,
          companyVerified: user.companyVerified
        })
        console.log(`✓ Пользователь ${user.name} создан`)
      } catch (error: any) {
        if (error.code === '23505') { // unique_violation
          console.log(`⚠ Пользователь ${user.email} уже существует`)
        } else {
          console.error(`✗ Ошибка создания пользователя ${user.name}:`, error.message)
        }
      }
    }

    // Миграция книг
    console.log('Мигрируем книги...')
    for (const book of books) {
      try {
        await BookService.create({
          sellerId: book.sellerId,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          description: book.description,
          genre: book.genre,
          publisher: book.publisher,
          price: book.price,
          stock: book.stock,
          imageUrl: book.imageUrl,
          publicationYear: book.publicationYear,
          language: book.language,
          pages: book.pages
        })
        console.log(`✓ Книга "${book.title}" создана`)
      } catch (error: any) {
        if (error.code === '23505') { // unique_violation
          console.log(`⚠ Книга с ISBN ${book.isbn} уже существует`)
        } else {
          console.error(`✗ Ошибка создания книги "${book.title}":`, error.message)
        }
      }
    }

    // Миграция заказов
    console.log('Мигрируем заказы...')
    for (const order of orders) {
      try {
        await OrderService.create({
          buyerId: order.buyerId,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          shippingAddress: order.shippingAddress,
          paymentId: order.paymentId
        })
        console.log(`✓ Заказ #${order.id} создан`)
      } catch (error: any) {
        console.error(`✗ Ошибка создания заказа #${order.id}:`, error.message)
      }
    }

    // Миграция отзывов
    console.log('Мигрируем отзывы...')
    for (const review of reviews) {
      try {
        await ReviewService.create({
          bookId: review.bookId,
          buyerId: review.buyerId,
          sellerId: review.sellerId,
          rating: review.rating,
          comment: review.comment
        })
        console.log(`✓ Отзыв для книги #${review.bookId} создан`)
      } catch (error: any) {
        console.error(`✗ Ошибка создания отзыва для книги #${review.bookId}:`, error.message)
      }
    }

    console.log('✅ Миграция завершена успешно!')

  } catch (error) {
    console.error('❌ Ошибка миграции:', error)
    throw error
  }
}

// Функция для очистки данных (использовать осторожно!)
export async function clearData() {
  console.log('⚠ Очищаем все данные...')

  try {
    // Удаляем в правильном порядке (учитывая внешние ключи)
    await supabase.from('reviews').delete().neq('id', '')
    await supabase.from('order_items').delete().neq('id', '')
    await supabase.from('orders').delete().neq('id', '')
    await supabase.from('books').delete().neq('id', '')
    await supabase.from('users').delete().neq('id', '')

    console.log('✅ Все данные очищены')
  } catch (error) {
    console.error('❌ Ошибка очистки данных:', error)
    throw error
  }
}
