import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Order, Product, User, AuthResponse, LoginRequest, RegisterRequest } from '../types/user.types'


const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token')
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    },
})

// ✅ Обёртка для автоматического обновления токена
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,              // тип аргументов (url или объект с параметрами)
    unknown,                         // тип успешного ответа (может быть любой)
    FetchBaseQueryError              // тип ошибки
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        console.warn('⏳ Access token expired, trying to refresh...')
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
            console.error('No refresh token found — user must log in again.')
            return result
        }

        // 🔁 Пытаемся получить новый токен
        const refreshResult = await baseQuery(
            {
                url: '/auth/refresh',
                method: 'POST',
                body: { token: refreshToken },
            },
            api,
            extraOptions
        )

        // 👉 ЯВНО говорим TypeScript, что это AuthResponse
        const refreshData = refreshResult.data as AuthResponse | undefined

        if (refreshData?.accessToken) {
            console.log('✅ Token refreshed successfully')
            localStorage.setItem('token', refreshData.accessToken)

            // Повторяем исходный запрос
            result = await baseQuery(args, api, extraOptions)
        } else {
            console.error('❌ Refresh token invalid — forcing logout.')
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('role')
        }
    }

    return result
}

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Users', 'Products', 'Orders'],
    endpoints: (builder) => ({
        // --- AUTH ---
        registerUser: builder.mutation<void, RegisterRequest>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
        }),

        loginUser: builder.mutation<AuthResponse, LoginRequest>({
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
            invalidatesTags: ['Orders'],
        }),

        deleteOrder: builder.mutation({
            query: (id: number) => ({
                url: `/orders/${id}`,
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
                url: `/products/${id}`,
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
    useDeleteOrderMutation,
    useGetProductsQuery,
    useDeleteProductMutation,
    useAddProductMutation,
} = usersApi