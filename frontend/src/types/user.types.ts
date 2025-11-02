export interface User {
    id: number
    name: string
    email: string
    created_at: string
    role: 'admin' | 'user'
}

export interface CreateUserDto {
    name: string;
    email: string;
}

export interface Order {
    id: number
    user_id: number
    product_name: string
    amount: number
    order_date: string
    image_url?: string
    user_name?: string
    description?: string
    rating?: number
    product_image?: string
    product_id?: number
}

export interface Product {
    id: number
    name: string
    description: string
    price: number
    image_url: string   // ✅ путь к файлу, например "/uploads/laptop.jpg"
    created_at?: string // опционально, если есть в БД
    rating?: number
}

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    message?: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
}