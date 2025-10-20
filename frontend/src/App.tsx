import { Routes, Route, Link } from 'react-router-dom'
import { UserForm } from './components/UserForm'
import { UserList } from './components/UserList'
import './App.css'
import {ProductsPage} from './pages/ProductsPage.tsx';

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <h1>User Management System</h1>
                <p className="subtitle">Express + RTK Query</p>

                {/* Навигация */}
                <nav>
                    <Link to="/users" className="link">👤 Users</Link>
                    {' | '}
                    <Link to="/products" className="link">🛒 Products</Link>
                </nav>
            </header>

            <main className="app-main">
                <Routes>
                    <Route
                        path="/users"
                        element={
                            <>
                                <UserForm />    {/* 👈 Форма создания пользователя */}
                                <UserList />    {/* 👈 Список пользователей */}
                            </>
                        }
                    />
                    <Route path="/products" element={<ProductsPage userId={1} />} /> {/* пример для user_id */}
                    <Route path="/" element={<p>Welcome! Choose a section 👆</p>} />
                </Routes>
            </main>
        </div>
    )
}

export default App