import './AdminDashboard.css'
import {useGetAllOrdersQuery} from '../services/usersApi'

export const AdminDashboard = () => {
    const { data: orders, isLoading, error } = useGetAllOrdersQuery()

    if (isLoading) return <p>Loading orders...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading orders</p>

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
            </section>
        </div>
    )
}