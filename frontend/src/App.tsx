import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { UserForm } from './components/UserForm'
import { UserList } from './components/UserList'
import { ProductsPage } from './pages/ProductsPage'
import { AuthPage } from './pages/AuthPage'
import { CartPage } from './pages/CartPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { Toaster } from 'react-hot-toast' // ✅ добавлено
import { confirmAction, notifyInfo, notifyError } from './utils/alerts' // ✅ добавлено
import './App.css'
import type { JSX } from 'react'

/* 🔐 Защищённый маршрут */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token')
    if (!token) {
        notifyError('🔒 Please log in first')
        return <Navigate to="/auth" replace />
    }
    return children
}

/* 👑 Только для админов */
const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') {
        notifyError('🚫 Access denied. Admins only.')
        return <Navigate to="/products" replace />
    }
    return children
}

function App() {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('role')
    const isAuth = Boolean(token)
    const isAdmin = userRole === 'admin'

    const handleLogout = async () => {
        const confirmed = await confirmAction('Do you really want to log out?', 'Logout')
        if (confirmed) {
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            localStorage.removeItem('userId')
            notifyInfo('👋 Logged out successfully')
            window.location.href = '/auth'
        }
    }

    return (
        <div className="app">
            {/* ✅ Toast подключён глобально */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: { background: '#333', color: '#fff' },
                }}
            />

            <header className="app-header">
                <h1>User Management System</h1>
                <p className="subtitle">Express + RTK Query</p>

                <nav>
                    {!isAuth ? (
                        <>
                            <Link to="/auth" className="link">🔑 Auth</Link>{' | '}
                            <Link to="/products" className="link">🛒 Products</Link>
                        </>
                    ) : (
                        <>
                            {isAdmin && (
                                <>
                                    <Link to="/users" className="link">👤 Users</Link>{' | '}
                                    <Link to="/admin" className="link">⚙️ Admin</Link>{' | '}
                                </>
                            )}

                            <Link to="/products" className="link">🛒 Products</Link>{' | '}
                            {!isAdmin && (
                                <Link to="/cart" className="link">🛍 Cart</Link>
                            )}
                            {' | '}
                            <button onClick={handleLogout} className="logout-btn">
                                🚪 Logout
                            </button>
                        </>
                    )}
                </nav>
            </header>

            <main className="app-main">
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />

                    <Route
                        path="/users"
                        element={
                            <AdminRoute>
                                <>
                                    <UserForm />
                                    <UserList />
                                </>
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />

                    <Route path="/products" element={<ProductsPage userId={1} />} />

                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                {isAdmin ? (
                                    <Navigate to="/products" replace />
                                ) : (
                                    <CartPage />
                                )}
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/products" replace />} />
                </Routes>
            </main>
        </div>
    )
}

export default App