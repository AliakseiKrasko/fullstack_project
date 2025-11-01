import { useGetUserOrdersQuery, useDeleteOrderMutation } from '../services/usersApi'
import { useNavigate } from 'react-router-dom'
import './CartPage.css'
import { jwtDecode } from 'jwt-decode'
import { confirmAction, notifyError, notifySuccess } from '../utils/alerts'

interface DecodedToken {
    id: number
    email: string
    role: string
    exp: number
}

export const CartPage = () => {
    const token = localStorage.getItem('token')
    const isAuth = Boolean(token)
    const navigate = useNavigate()

    let userId: number | null = null
    if (token) {
        try {
            const decoded = jwtDecode<DecodedToken>(token)
            userId = decoded.id
        } catch (err) {
            console.error('Invalid token:', err)
            notifyError('Invalid token. Please log in again.')
        }
    }

    const { data: orders, isLoading, error, refetch } = useGetUserOrdersQuery(userId!, {
        skip: !isAuth || !userId,
    })
    const [deleteOrder] = useDeleteOrderMutation()

    // 🧮 Вычисляем общую сумму корзины
    const totalAmount =
        orders?.reduce((sum, order) => sum + Number(order.amount || 0), 0) ?? 0

    // 🗑 Удаление товара
    const handleDelete = async (id: number) => {
        const confirmed = await confirmAction('Remove this item from your cart?', 'Confirm deletion')
        if (!confirmed) return

        try {
            await deleteOrder(id).unwrap()
            await refetch() // обновляем корзину после удаления
            notifySuccess('🗑 Item deleted successfully')
        } catch (err) {
            console.error('❌ Error deleting order:', err)
            notifyError('❌ Failed to delete item')
        }
    }

    if (!isAuth) {
        return (
            <div className="cart-page">
                <h2>🛒 Your Cart</h2>
                <p>Please log in to view your cart.</p>
                <button className="login-btn" onClick={() => navigate('/auth')}>
                    Go to Login
                </button>
            </div>
        )
    }

    if (isLoading) return <p>Loading your cart...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading cart.</p>

    return (
        <div className="cart-page">
            <h2>🛍 Your Orders</h2>

            {orders && orders.length > 0 ? (
                <>
                    <ul className="cart-grid">
                        {orders.map((order) => (
                            <li key={order.id} className="cart-card">
                                {order.image_url && (
                                    <img
                                        src={`http://localhost:3000${order.image_url}`}
                                        alt={order.product_name}
                                        className="cart-image"
                                    />
                                )}
                                <div className="cart-info">
                                    <strong>{order.product_name}</strong> — ${order.amount}
                                    <br />
                                    <small>{new Date(order.order_date).toLocaleString()}</small>
                                </div>
                                <button className="delete-btn" onClick={() => handleDelete(order.id)}>
                                    🗑 Delete
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* 💰 Общая сумма всех товаров */}
                    <div className="cart-total">
                        <h3>
                            💰 Total Amount:{' '}
                            <span style={{ color: '#2ecc71' }}>${totalAmount.toFixed(2)}</span>
                        </h3>
                    </div>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    )
}