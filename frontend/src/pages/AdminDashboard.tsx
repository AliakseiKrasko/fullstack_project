import { Link, useNavigate } from 'react-router-dom'
import './AdminDashboard.css'
import { useGetUsersQuery } from '../services/usersApi'

export const AdminDashboard = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('role')

    // ✅ выносим хук наверх — до любых return
    const { data: users, isLoading, error } = useGetUsersQuery(undefined, {
        skip: !token || userRole !== 'admin', // 👈 хук не выполняется, если не админ
    })

    // 🔒 Проверка роли
    if (!token || userRole !== 'admin') {
        alert('Access denied: Admins only!')
        navigate('/products')
        return null
    }

    if (isLoading) return <p>Loading users...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading users</p>

    return (
        <div className="admin-page">
            <h2>👑 Admin Dashboard</h2>
            <p>Welcome, Admin! You have full control over the system.</p>

            <div className="admin-sections">
                <Link to="/products" className="admin-card">
                    🛒 Manage Products
                </Link>
                <Link to="/cart" className="admin-card">
                    🧾 View Orders
                </Link>
                <div className="admin-card users-section">
                    <h3>👤 Users</h3>
                    <ul>
                        {users?.map((u) => (
                            <li key={u.id}>
                                {u.name} — {u.email} ({u.role})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}