import { migrateData, clearData } from './lib/migrateData'

async function testMigration() {
  console.log('🧪 Тестируем миграцию данных в Supabase...\n')

  try {
    // Сначала очищаем данные (опционально)
    console.log('Очищаем существующие данные...')
    await clearData()
    console.log('✅ Данные очищены\n')

    // Выполняем миграцию
    console.log('Запускаем миграцию...')
    await migrateData()
    console.log('✅ Миграция завершена успешно!\n')

    // Проверяем результаты
    console.log('🔍 Проверяем результаты миграции...')

    // Импортируем сервисы для проверки
    const { UserService } = await import('./lib/services/userService')
    const { BookService } = await import('./lib/services/bookService')
    const { OrderService } = await import('./lib/services/orderService')
    const { ReviewService } = await import('./lib/services/reviewService')

    // Проверяем пользователей
    const users = await UserService.getAll()
    console.log(`👥 Пользователей: ${users.length}`)

    // Проверяем книги
    const books = await BookService.getAll()
    console.log(`📚 Книг: ${books.length}`)

    // Проверяем заказы
    const orders = await OrderService.getAll()
    console.log(`📦 Заказов: ${orders.length}`)

    // Проверяем отзывы
    const reviews = await ReviewService.getAll()
    console.log(`⭐ Отзывов: ${reviews.length}`)

    console.log('\n✅ Тестирование миграции завершено успешно!')

  } catch (error) {
    console.error('❌ Ошибка при тестировании миграции:', error)
    process.exit(1)
  }
}

// Запускаем тест только если файл запущен напрямую
if (require.main === module) {
  testMigration()
}

export { testMigration }
