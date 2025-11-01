import { useState } from "react"
import {
    useDeleteOrderMutation,
    useDeleteUserMutation,
    useGetUserOrdersQuery,
} from "../services/usersApi"
import type { User } from "../types/user.types.ts"

interface UserItemProps {
    user: User
}

export const UserItem = ({ user }: UserItemProps) => {
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
    const [showOrders, setShowOrders] = useState(false)
    const { data: orders, isLoading: isLoadingOrders, error } = useGetUserOrdersQuery(user.id, {
        skip: !showOrders,
    })
    const [deleteOrder] = useDeleteOrderMutation()

    const handleDelete = async () => {
        if (window.confirm(`Удалить пользователя ${user.name}?`)) {
            try {
                await deleteUser(user.id).unwrap()
            } catch (err) {
                console.error("Ошибка при удалении пользователя:", err)
                alert("Не удалось удалить пользователя")
            }
        }
    }

    // 💰 вычисляем общую сумму заказов пользователя
    const totalAmount = orders?.reduce((sum, o) => sum + Number(o.amount || 0), 0) ?? 0

    return (
        <div className="user-item">
            <div className="user-info">
                <strong>{user.name}</strong>{" ----- "}
                <span>{user.email}</span>
                <small>{new Date(user.created_at).toLocaleString()}</small>
            </div>

            <div className="actions">
                <button
                    className="delete-btn"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>

                <button
                    className="orders-btn"
                    onClick={() => setShowOrders(!showOrders)}
                >
                    {showOrders ? "Hide orders" : "Show orders"}
                </button>
            </div>

            {showOrders && (
                <div className="orders">
                    {isLoadingOrders && <p>Loading orders...</p>}
                    {error && <p style={{ color: "red" }}>Error loading orders</p>}

                    {orders && orders.length > 0 ? (
                        <>
                            <ul className="orders-list">
                                {orders.map((order) => (
                                    <li key={order.id} className="order-item">
                                        <div>
                                            {order.product_name} — ${order.amount}
                                            <br />
                                            <small>{new Date(order.order_date).toLocaleString()}</small>
                                        </div>
                                        <button
                                            className="delete-order-btn"
                                            onClick={() => deleteOrder(order.id)}
                                        >
                                            🗑
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* 💵 Общая сумма заказов */}
                            <p className="total-amount">
                                💰 Total: <span style={{ color: "#2ecc71" }}>${totalAmount.toFixed(2)}</span>
                            </p>
                        </>
                    ) : (
                        !isLoadingOrders && <p>No orders found</p>
                    )}
                </div>
            )}
        </div>
    )
}