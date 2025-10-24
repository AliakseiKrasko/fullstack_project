import { useGetUserOrdersQuery } from '../services/usersApi'
import { useNavigate } from 'react-router-dom'
import './CartPage.css'

interface CartPageProps {
    userId: number
}

export const CartPage = ({ userId }: CartPageProps) => {
    const token = localStorage.getItem('token')
    const isAuth = Boolean(token)
    const navigate = useNavigate()

    // Загружаем заказы пользователя, если авторизован
    const { data: orders, isLoading, error } = useGetUserOrdersQuery(userId, {
        skip: !isAuth,
    })

    // Неавторизованного перенаправляем к логину
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

    // Авторизованный — видит свои заказы
    if (isLoading) return <p>Loading your cart...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading cart.</p>

    return (
        <div className="cart-page">
            <h2>🛍 Your Orders</h2>
            {orders && orders.length > 0 ? (
                <ul className="cart-list">
                    {orders.map((order) => (
                        <li key={order.id} className="cart-item">
                            {order.image_url && (
                                <img
                                    src={`http://localhost:3000${order.image_url}`}
                                    alt={order.product_name}
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        objectFit: 'contain',
                                        borderRadius: '10px',
                                        backgroundColor: '#fff',
                                        padding: '8px',
                                        marginBottom: '10px',
                                    }}
                                />
                            )}
                            <strong>{order.product_name}</strong> — ${order.amount}
                            <br/>
                            <small>{new Date(order.order_date).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    )
}