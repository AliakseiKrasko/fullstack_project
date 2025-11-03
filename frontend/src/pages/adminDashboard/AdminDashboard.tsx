import './AdminDashboard.css'
import { useGetAllOrdersQuery } from '../../services/usersApi'
import type { Order } from '../../types/user.types'

export const AdminDashboard = () => {
    const { data: orders, isLoading, error } = useGetAllOrdersQuery()

    if (isLoading) return <p>Loading orders...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading orders</p>

    // ✅ Группировка заказов по пользователям
    const groupedOrders = (orders ?? []).reduce<Record<string, Order[]>>((acc, order) => {
        const user = order.user_name ?? 'Unknown User'
        if (!acc[user]) acc[user] = []
        acc[user].push(order)
        return acc
    }, {})

    // 💰 Общая сумма всех заказов
    const totalAmount =
        orders?.reduce((sum, order) => sum + Number(order.amount || 0), 0) ?? 0

    return (
        <div className="admin-page">
            <h2>👑 Admin Dashboard</h2>

            <section>
                <h3>📋 Orders by Users</h3>

                {Object.entries(groupedOrders).map(([user, userOrders]) => {
                    // 🧮 Считаем сумму по конкретному пользователю
                    const userTotal = userOrders.reduce(
                        (sum, order) => sum + Number(order.amount || 0),
                        0
                    )

                    return (
                        <div key={user} className="user-orders">
                            <h2>👤 {user}</h2>

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

                            {/* 💵 Общая сумма по конкретному пользователю */}
                            <p className="user-total">
                                💵 Total by {user}:{' '}
                                <span style={{ color: '#333333' }}>
                                    ${userTotal.toFixed(2)}
                                </span>
                            </p>
                        </div>
                    )
                })}

                {/* 💰 Общая сумма по всем пользователям */}
                <h3 style={{ marginTop: '20px' }}>
                    💰 Total Revenue:{' '}
                    <span style={{ color: '#333333' }}>
                        ${totalAmount.toFixed(2)}
                    </span>
                </h3>
            </section>
        </div>
    )
}