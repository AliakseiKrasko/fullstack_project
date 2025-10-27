import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { UserForm } from './components/UserForm'
import { UserList } from './components/UserList'
import { ProductsPage } from './pages/ProductsPage'
import { AuthPage } from './pages/AuthPage'
import { CartPage } from './pages/CartPage'
import './App.css'
import type { JSX } from 'react'

/* 🔐 Компонент защиты маршрутов */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token')
    if (!token) {
        alert('🔒 Please log in first')
        return <Navigate to="/auth" replace />
    }
    return children
}

function App() {
    const token = localStorage.getItem('token')
    const isAuth = Boolean(token)

    const handleLogout = () => {
        localStorage.removeItem('token')
        alert('👋 Logged out successfully')
        window.location.href = '/auth'
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>User Management System</h1>
                <p className="subtitle">Express + RTK Query</p>

                {/* 🔗 Навигация */}
                <nav>
                    {!isAuth ? (
                        <>
                            <Link to="/auth" className="link">🔑 Auth</Link>{' | '}
                            <Link to="/products" className="link">🛒 Products</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="link">🔑 Auth</Link>{' | '}
                            <Link to="/users" className="link">👤 Users</Link>{' | '}
                            <Link to="/products" className="link">🛒 Products</Link>{' | '}
                            <Link to="/cart" className="link">🛍 Cart</Link>{' | '}
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

                    {/* 👤 Users — защищённый маршрут */}
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <>
                                    <UserForm />
                                    <UserList />
                                </>
                            </ProtectedRoute>
                        }
                    />

                    {/* 🛒 Products — доступна всем */}
                    <Route path="/products" element={<ProductsPage userId={1} />} />

                    {/* 🛍 Cart — только авторизованным */}
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <CartPage userId={1} />
                            </ProtectedRoute>
                        }
                    />

                    {/* 🏠 Главная — теперь редирект на /products */}
                    <Route path="/" element={<Navigate to="/products" replace />} />
                </Routes>
            </main>
        </div>
    )
}

export default App