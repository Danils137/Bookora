// Типы для Supabase
export type UserRole = 'buyer' | 'seller' | 'admin'
export type UserStatus = 'active' | 'pending' | 'suspended'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

// Интерфейсы для работы с базой данных
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  companyName?: string;
  companyVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  sellerId: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  genre: string;
  publisher: string;
  price: number;
  stock: number;
  imageUrl: string;
  publicationYear: number;
  language: string;
  pages: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id?: string;
  orderId?: string;
  bookId: string;
  sellerId: string;
  quantity: number;
  price: number;
  book?: Book;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Review {
  id: string;
  bookId: string;
  buyerId: string;
  sellerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CartItem {
  bookId: string;
  quantity: number;
  book?: Book;
}

export interface SellerStats {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
  totalReviews: number;
}

export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  totalBooks: number;
  totalOrders: number;
  totalRevenue: number;
}

// Типы для Supabase таблиц (используются в Database типе)
export type DatabaseUser = {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  status: UserStatus
  company_name?: string
  company_verified?: boolean
  created_at: string
  updated_at: string
}

export type DatabaseBook = {
  id: string
  seller_id: string
  title: string
  author: string
  isbn: string
  description: string
  genre: string
  publisher: string
  price: number
  stock: number
  image_url: string
  publication_year: number
  language: string
  pages: number
  created_at: string
  updated_at: string
}

export type DatabaseOrder = {
  id: string
  buyer_id: string
  total_amount: number
  status: OrderStatus
  shipping_address: Address
  payment_id?: string
  created_at: string
  updated_at: string
}

export type DatabaseOrderItem = {
  id: string
  order_id: string
  book_id: string
  seller_id: string
  quantity: number
  price: number
}

export type DatabaseReview = {
  id: string
  book_id: string
  buyer_id: string
  seller_id: string
  rating: number
  comment: string
  created_at: string
}

// Вспомогательные типы для преобразования данных
export type SupabaseUser = Omit<DatabaseUser, 'created_at' | 'updated_at'> & {
  createdAt: Date;
  updatedAt: Date;
}

export type SupabaseBook = Omit<DatabaseBook, 'created_at' | 'updated_at' | 'seller_id' | 'image_url'> & {
  sellerId: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SupabaseOrder = Omit<DatabaseOrder, 'created_at' | 'updated_at' | 'buyer_id' | 'shipping_address'> & {
  buyerId: string;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export type SupabaseOrderItem = Omit<DatabaseOrderItem, 'order_id' | 'book_id' | 'seller_id'> & {
  orderId: string;
  bookId: string;
  sellerId: string;
}

export type SupabaseReview = Omit<DatabaseReview, 'created_at' | 'book_id' | 'buyer_id' | 'seller_id'> & {
  bookId: string;
  buyerId: string;
  sellerId: string;
  createdAt: Date;
}

// Тип базы данных для Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: DatabaseUser
        Insert: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>>
      }
      books: {
        Row: DatabaseBook
        Insert: Omit<DatabaseBook, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseBook, 'id' | 'created_at' | 'updated_at'>>
      }
      orders: {
        Row: DatabaseOrder
        Insert: Omit<DatabaseOrder, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseOrder, 'id' | 'created_at' | 'updated_at'>>
      }
      order_items: {
        Row: DatabaseOrderItem
        Insert: Omit<DatabaseOrderItem, 'id'>
        Update: Partial<Omit<DatabaseOrderItem, 'id'>>
      }
      reviews: {
        Row: DatabaseReview
        Insert: Omit<DatabaseReview, 'id' | 'created_at'>
        Update: Partial<Omit<DatabaseReview, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      user_status: UserStatus
      order_status: OrderStatus
    }
  }
}
