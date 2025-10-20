# Миграция на Supabase

Этот документ описывает процесс миграции базы данных Bookora с локальной mock-базы данных на Supabase.

## 📋 Что было сделано

### ✅ Завершенные этапы

1. **Анализ текущей структуры** - Проанализирована существующая mock-база данных
2. **Установка зависимостей** - Установлен `@supabase/supabase-js`
3. **Конфигурация Supabase** - Создан `.env.local` с ключами Supabase
4. **Создание SQL схемы** - Создана полная схема базы данных с таблицами:
   - `users` - пользователи
   - `books` - книги
   - `orders` - заказы
   - `order_items` - элементы заказов
   - `reviews` - отзывы
5. **Создание сервисов** - Разработаны сервисы для работы с каждой таблицей
6. **Обновление tRPC роутов** - Обновлены роуты для использования Supabase

## 🗄️ Структура базы данных

### Таблицы

#### users
- `id` (UUID, Primary Key)
- `email` (TEXT, UNIQUE)
- `password` (TEXT)
- `name` (TEXT)
- `role` (TEXT: buyer, seller, admin)
- `status` (TEXT: active, pending, suspended)
- `company_name` (TEXT, nullable)
- `company_verified` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### books
- `id` (UUID, Primary Key)
- `seller_id` (UUID, Foreign Key → users.id)
- `title` (TEXT)
- `author` (TEXT)
- `isbn` (TEXT, UNIQUE)
- `description` (TEXT)
- `genre` (TEXT)
- `publisher` (TEXT)
- `price` (DECIMAL)
- `stock` (INTEGER)
- `image_url` (TEXT)
- `publication_year` (INTEGER)
- `language` (TEXT)
- `pages` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### orders
- `id` (UUID, Primary Key)
- `buyer_id` (UUID, Foreign Key → users.id)
- `total_amount` (DECIMAL)
- `status` (TEXT: pending, processing, shipped, delivered, cancelled)
- `shipping_address` (JSONB)
- `payment_id` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### order_items
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → orders.id)
- `book_id` (UUID, Foreign Key → books.id)
- `seller_id` (UUID, Foreign Key → users.id)
- `quantity` (INTEGER)
- `price` (DECIMAL)

#### reviews
- `id` (UUID, Primary Key)
- `book_id` (UUID, Foreign Key → books.id)
- `buyer_id` (UUID, Foreign Key → users.id)
- `seller_id` (UUID, Foreign Key → users.id)
- `rating` (INTEGER, 1-5)
- `comment` (TEXT)
- `created_at` (TIMESTAMP)

## 🔒 Row Level Security (RLS)

Настроены политики безопасности для всех таблиц:

- **users**: Пользователи могут просматривать и редактировать только свой профиль
- **books**: Книги доступны для просмотра всем, редактировать могут только продавцы
- **orders**: Покупатели видят свои заказы, продавцы - заказы на свои книги
- **reviews**: Отзывы доступны для просмотра всем, управлять могут только авторы

## 🚀 Как использовать

### 1. Настройка Supabase

1. Выполните SQL скрипт `supabase-schema.sql` в SQL Editor вашего Supabase проекта
2. Убедитесь, что переменные окружения в `.env.local` корректны

### 2. Миграция данных

```bash
# Установка зависимостей
npm install

# Тестирование миграции (очистит существующие данные и загрузит тестовые)
npx ts-node test-migration.ts
```

### 3. Запуск приложения

```bash
# Запуск сервера
npm run server

# Запуск веб-приложения
npm run start-web
```

## 📁 Структура файлов

```
├── lib/
│   ├── supabase.ts              # Supabase клиент
│   ├── services/
│   │   ├── userService.ts       # Сервис для работы с пользователями
│   │   ├── bookService.ts       # Сервис для работы с книгами
│   │   ├── orderService.ts      # Сервис для работы с заказами
│   │   └── reviewService.ts     # Сервис для работы с отзывами
│   ├── migrateData.ts           # Скрипт миграции данных
│   └── mock-db.ts               # Исходная mock-база данных
├── supabase-schema.sql          # SQL схема для Supabase
├── test-migration.ts            # Тест миграции
└── types/
    └── database.ts              # Обновленные типы с поддержкой Supabase
```

## 🔧 Доступные сервисы

### UserService
- `getAll()` - получить всех пользователей
- `getById(id)` - получить пользователя по ID
- `getByEmail(email)` - получить пользователя по email
- `create(userData)` - создать пользователя
- `update(id, userData)` - обновить пользователя
- `delete(id)` - удалить пользователя
- `getSellers()` - получить продавцов
- `getBuyers()` - получить покупателей

### BookService
- `getAll()` - получить все книги
- `getById(id)` - получить книгу по ID
- `getBySeller(sellerId)` - получить книги продавца
- `getByGenre(genre)` - получить книги по жанру
- `search(query)` - поиск книг
- `create(bookData)` - создать книгу
- `update(id, bookData)` - обновить книгу
- `delete(id)` - удалить книгу
- `updateStock(id, stock)` - обновить количество
- `getPopularGenres()` - популярные жанры
- `getSellerStats(sellerId)` - статистика продавца

### OrderService
- `getAll()` - получить все заказы
- `getById(id)` - получить заказ по ID
- `getByBuyer(buyerId)` - получить заказы покупателя
- `getBySeller(sellerId)` - получить заказы продавца
- `create(orderData)` - создать заказ
- `updateStatus(id, status)` - обновить статус заказа
- `update(id, orderData)` - обновить заказ
- `delete(id)` - удалить заказ
- `getStats()` - статистика заказов
- `getByStatus(status)` - заказы по статусу

### ReviewService
- `getAll()` - получить все отзывы
- `getById(id)` - получить отзыв по ID
- `getByBook(bookId)` - получить отзывы к книге
- `getByBuyer(buyerId)` - получить отзывы покупателя
- `getBySeller(sellerId)` - получить отзывы продавца
- `create(reviewData)` - создать отзыв
- `update(id, reviewData)` - обновить отзыв
- `delete(id)` - удалить отзыв
- `getBookStats(bookId)` - статистика отзывов книги
- `getSellerStats(sellerId)` - статистика отзывов продавца
- `hasUserReviewedBook(bookId, buyerId)` - проверка отзыва

## 🔄 Миграция данных

Для миграции существующих данных из mock-базы:

```typescript
import { migrateData } from './lib/migrateData'

await migrateData()
```

## ⚠️ Важные замечания

1. **Безопасность**: Убедитесь, что RLS политики настроены правильно
2. **Бэкапы**: Создайте резервную копию данных перед миграцией
3. **Тестирование**: Протестируйте все операции после миграции
4. **Индексы**: Созданные индексы оптимизируют запросы
5. **Типы**: Обновлены типы для совместимости с Supabase

## 🚨 Возможные проблемы

1. **Дубликаты**: При миграции могут возникнуть ошибки уникальности
2. **Связи**: Убедитесь в правильности внешних ключей
3. **RLS**: Проверьте, что политики безопасности не блокируют операции

## 📞 Поддержка

При возникновении проблем проверьте:
1. Корректность переменных окружения
2. Выполнение SQL схемы в Supabase
3. Логи ошибок в консоли
4. Настройки RLS в Supabase Dashboard
