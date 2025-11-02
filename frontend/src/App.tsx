import {Toaster} from 'react-hot-toast' // ✅ добавлено
import {confirmAction, notifyInfo} from './utils/alerts' // ✅ добавлено
import './App.css'
import {Header} from './components/layout/Header.tsx';
import {AppRoutes} from './app/routes/AppRoutes.tsx';

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
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: { background: '#333', color: '#fff' },
                }}
            />
            <Header isAuth={isAuth} isAdmin={isAdmin} onLogout={handleLogout} />
            <main className="app-main">
                <AppRoutes isAdmin={isAdmin} />
            </main>
        </div>
    )
}


export default App