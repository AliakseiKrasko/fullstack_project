import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import './App.css';

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <h1>User Management System</h1>
                <p className="subtitle">Express + RTK Query</p>
                <UserForm />
            </header>
            <main className="app-main">
                <UserList />
            </main>
        </div>
    );
}

export default App;