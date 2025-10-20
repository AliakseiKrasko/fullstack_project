import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {Order, Product, User} from "../types/user.types.ts";

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000'}),
    tagTypes: ['Users', 'Orders', 'Products'],
    endpoints: (builder) => ({

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
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),

        // --- ORDERS ---
        getUserOrders: builder.query<Order[], number>({
            query: (userId) => `/users/${userId}/orders`,
            providesTags: ['Orders'],
        }),

        addOrder: builder.mutation({
            query: (order) => ({
                url: '/orders',
                method: 'POST',
                body: order,
            }),
            invalidatesTags: ['Orders'], // 👈 чтобы обновлялся список заказов
        }),

        // --- PRODUCTS ---
        getProducts: builder.query<Product[], void>({
            query: () => '/products',
            providesTags: ['Products'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useDeleteUserMutation,
    useGetUserOrdersQuery,
    useAddOrderMutation,
    useGetProductsQuery,
} = usersApi;