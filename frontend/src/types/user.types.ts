export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
}

export interface Order {
    id: number;
    user_id: number;
    product_name: string;
    amount: number;
    order_date: string;
}