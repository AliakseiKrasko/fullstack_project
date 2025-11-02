import { useState } from 'react'
import {
    useDeleteOrderMutation,
    useDeleteUserMutation,
    useGetUserOrdersQuery,
} from '../../services/usersApi.ts'
import type { User } from '../../types/user.types.ts'
import { notifyError, notifySuccess, confirmAction } from '../../utils/alerts.ts'
import { motion, AnimatePresence } from 'framer-motion'
import './UserItem.css'

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
        const confirmed = await confirmAction(`Delete user "${user.name}"?`, 'Confirm Deletion')
        if (!confirmed) return
        try {
            await deleteUser(user.id).unwrap()
            notifySuccess(`User "${user.name}" deleted successfully!`)
        } catch {
            notifyError('❌ Failed to delete user')
        }
    }

    const handleDeleteOrder = async (orderId: number) => {
        const confirmed = await confirmAction('Delete this order?', 'Confirm')
        if (!confirmed) return
        try {
            await deleteOrder(orderId).unwrap()
            notifySuccess('✅ Order deleted successfully!')
        } catch {
            notifyError('❌ Failed to delete order')
        }
    }

    const totalAmount = orders?.reduce((sum, o) => sum + Number(o.amount || 0), 0) ?? 0

    return (
        <motion.div
            className="user-item"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="user-header">
                <div>
                    <strong>{user.name}</strong> — <span>{user.email}</span>
                    <p className="user-date">
                        {new Date(user.created_at).toLocaleDateString()} {new Date(user.created_at).toLocaleTimeString()}
                    </p>
                </div>

                <div className="actions">
                    <button className="delete-btn" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button className="orders-btn" onClick={() => setShowOrders(!showOrders)}>
                        {showOrders ? 'Hide orders' : 'Show orders'}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showOrders && (
                    <motion.div
                        className="orders-container"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isLoadingOrders && <p>Loading orders...</p>}
                        {error && <p className="error-text">Error loading orders</p>}

                        {orders && orders.length > 0 ? (
                            <>
                                <div className="orders-grid">
                                    {orders.map((order) => (
                                        <motion.div
                                            key={order.id}
                                            className="order-card"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                        >
                                            <img
                                                src={`http://localhost:3000${order.image_url}`}
                                                alt={order.product_name}
                                                className="order-img"
                                            />
                                            <div className="order-info">
                                                <p className="order-name">{order.product_name}</p>
                                                <p className="order-price">${order.amount}</p>
                                                <small className="order-date">
                                                    {new Date(order.order_date).toLocaleString()}
                                                </small>
                                            </div>
                                            <button
                                                className="delete-order-btn"
                                                onClick={() => handleDeleteOrder(order.id)}
                                            >
                                                🗑
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                <p className="total-amount">
                                    💰 Total: <span className="total-value">${totalAmount.toFixed(2)}</span>
                                </p>
                            </>
                        ) : (
                            !isLoadingOrders && <p className="no-orders">No orders found</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}