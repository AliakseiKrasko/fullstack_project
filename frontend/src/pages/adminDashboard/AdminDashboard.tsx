import './AdminDashboard.css'
import { useGetAllOrdersQuery } from '../../services/usersApi'
import type { Order } from '../../types/user.types'

export const AdminDashboard = () => {
    const { data: orders, isLoading, error } = useGetAllOrdersQuery()

    if (isLoading) return <p>Loading orders...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading orders</p>

    // ✅ Группируем с защитой от undefined
    const groupedOrders = (orders ?? []).reduce<Record<string, Order[]>>((acc, order) => {
        const user = order.user_name ?? 'Unknown User' // безопасно
        if (!acc[user]) acc[user] = []
        acc[user].push(order)
        return acc
    }, {})

    const totalAmount =
        orders?.reduce((sum, order) => sum + Number(order.amount || 0), 0) ?? 0

    return (
        <div className="admin-page">
            <h2>👑 Admin Dashboard</h2>

            <section>
                <h3>📋 Orders by Users</h3>

                {Object.entries(groupedOrders).map(([user, userOrders]) => (
                    <div key={user} className="user-orders">
                        <h4>👤 {user}</h4>

                        <table className="orders-table">
                            <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <img
                                            src={`http://localhost:3000${order.image_url}`}
                                            alt={order.product_name}
                                            width={50}
                                        />
                                    </td>
                                    <td>{order.product_name}</td>
                                    <td>${Number(order.amount).toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}

                <h3 style={{ marginTop: '20px' }}>
                    💰 Total Revenue:{' '}
                    <span style={{ color: '#2ecc71' }}>${totalAmount.toFixed(2)}</span>
                </h3>
            </section>
        </div>
    )
}