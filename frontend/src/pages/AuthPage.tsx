import { useState } from 'react'
import { useRegisterUserMutation, useLoginUserMutation } from '../services/usersApi'
import { jwtDecode } from 'jwt-decode'

export const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(true)
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [registerUser, { isLoading: regLoading }] = useRegisterUserMutation()
    const [loginUser, { isLoading: logLoading }] = useLoginUserMutation()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (isRegister) {
                await registerUser(form).unwrap()
                alert('✅ Registration successful! Please log in.')
                setIsRegister(false)
            } else {
                const res = await loginUser({
                    email: form.email,
                    password: form.password,
                }).unwrap()

                // 💾 Сохраняем токены
                localStorage.setItem('token', res.accessToken)
                localStorage.setItem('refreshToken', res.refreshToken)

                // 🧠 Декодируем токен и сохраняем роль
                const decoded = jwtDecode<{ role: string }>(res.accessToken)
                localStorage.setItem('role', decoded.role)

                alert('✅ Logged in successfully!')

                // 🎯 Автоматический редирект
                if (decoded.role === 'admin') {
                    window.location.href = '/admin'
                } else {
                    window.location.href = '/products'
                }
            }
        } catch (err: any) {
            alert(`❌ ${err?.data?.message || 'Something went wrong'}`)
        }
    }

    return (
        <div className="auth-page">
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                {isRegister && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={regLoading || logLoading}>
                    {isRegister
                        ? regLoading
                            ? 'Registering...'
                            : 'Register'
                        : logLoading
                            ? 'Logging in...'
                            : 'Login'}
                </button>
            </form>

            <p>
                {isRegister ? 'Already have an account?' : 'Need to register?'}{' '}
                <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? 'Login' : 'Register'}
                </button>
            </p>
        </div>
    )
}