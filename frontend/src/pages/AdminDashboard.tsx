import './AdminDashboard.css'
import { useGetAllOrdersQuery } from '../services/usersApi'

export const AdminDashboard = () => {
    const { data: orders, isLoading, error } = useGetAllOrdersQuery()

    if (isLoading) return <p>Loading orders...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading orders</p>

    // 🧮 Считаем общую сумму всех заказов
    const totalAmount = orders?.reduce((sum, order) => sum + Number(order.amount || 0), 0) ?? 0

    return (
        <div className="admin-page">
            <h2>👑 Admin Dashboard</h2>

            <section>
                <h3>📦 All Orders</h3>

                <ul>
                    {orders?.map(order => (
                        <li key={order.id}>
                            <img
                                src={`http://localhost:3000${order.image_url}`}
                                alt={order.product_name}
                                width={50}
                            />
                            <span>{order.product_name} — ${order.amount}</span> | {order.user_name}
                        </li>
                    ))}
                </ul>

                {/* 💰 Общая сумма всех заказов */}
                <h3 style={{ marginTop: '20px' }}>
                    💰 Total Revenue: <span style={{ color: '#2ecc71' }}>${totalAmount.toFixed(2)}</span>
                </h3>
            </section>
        </div>
    )
}