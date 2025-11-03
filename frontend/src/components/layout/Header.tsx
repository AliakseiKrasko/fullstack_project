import { Link } from 'react-router-dom'
import './Header.css'



type HeaderProps = {
    isAuth: boolean
    isAdmin: boolean
    onLogout: () => void
}

export const Header = ({ isAuth, isAdmin, onLogout }: HeaderProps) => (
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
                    {!isAdmin && <Link to="/cart" className="link">🛍 Cart</Link>}
                    {' | '}
                    <button onClick={onLogout} className="logout-btn">
                        🚪 Logout
                    </button>
                </>
            )}
        </nav>
    </header>
)