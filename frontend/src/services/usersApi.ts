import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Order, Product, User } from "../types/user.types.ts"

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('authorization', `Bearer ${token}`) // ✅ исправлено
            }
            return headers
        },
    }),
    tagTypes: ['Users', 'Products', 'Orders'],
    endpoints: (builder) => ({
        // 🔹 регистрация
        registerUser: builder.mutation({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
        }),

        // 🔹 логин
        loginUser: builder.mutation({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),

        // --- USERS ---
        getUsers: builder.query<User[], void>({
            query: () => '/users',
            providesTags: ['Users'],
        }),

        createUser: builder.mutation({
            query: (userData) => ({
                url: '/users',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Users'],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`, // ✅ исправлено
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),

        // --- ORDERS ---
        getUserOrders: builder.query<Order[], number>({
            query: (userId) => `/users/${userId}/orders`, // ✅ исправлено
            providesTags: ['Orders'],
        }),

        addOrder: builder.mutation({
            query: (order) => ({
                url: '/orders',
                method: 'POST',
                body: order,
            }),
            invalidatesTags: ['Orders'],
        }),

        deleteOrder: builder.mutation({
            query: (id: number) => ({
                url: `/orders/${id}`, // ✅ исправлено
                method: 'DELETE',
            }),
            invalidatesTags: ['Orders'],
        }),

        // --- PRODUCTS ---
        getProducts: builder.query<Product[], void>({
            query: () => '/products',
            providesTags: ['Products'],
        }),

        deleteProduct: builder.mutation({
            query: (id: number) => ({
                url: `/products/${id}`, // ✅ исправлено
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),

        addProduct: builder.mutation({
            query: (product) => ({
                url: '/products',
                method: 'POST',
                body: product,
            }),
            invalidatesTags: ['Products'],
        }),
    }),
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetUsersQuery,
    useCreateUserMutation,
    useDeleteUserMutation,
    useGetUserOrdersQuery,
    useAddOrderMutation,
    useGetProductsQuery,
    useDeleteOrderMutation,
    useDeleteProductMutation,
    useAddProductMutation,
} = usersApi