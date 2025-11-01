import { useState } from 'react'
import { useCreateUserMutation } from '../services/usersApi'
import { notifyError, notifySuccess } from '../utils/alerts'

export const UserForm = () => {
    const [createUser, { isLoading, error }] = useCreateUserMutation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [validationError, setValidationError] = useState('')

    // 🧩 Обработка отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setValidationError('')

        if (!name.trim() || !email.trim()) {
            setValidationError('⚠️ All fields are required')
            notifyError('⚠️ Please fill in all fields')
            return
        }

        try {
            await createUser({ name, email }).unwrap()
            setName('')
            setEmail('')
            notifySuccess(`✅ User "${name}" added successfully!`)
        } catch (err: unknown) {
            if (typeof err === 'object' && err && 'data' in err) {
                const apiError = err as { data?: { message?: string } }
                notifyError(`❌ ${apiError.data?.message || 'Failed to create user'}`)
            } else {
                notifyError('❌ Unexpected error occurred')
            }
        }
    }

    // 🧠 Формируем сообщение об ошибке
    const getErrorMessage = (): string => {
        if (validationError) return validationError

        if (error && 'data' in error) {
            const apiError = error as { data?: { message?: string } }
            return apiError.data?.message || 'Failed to create user'
        }

        return ''
    }

    const errorMessage = getErrorMessage()

    return (
        <form className="user-form" onSubmit={handleSubmit}>
            <h2>Add New User</h2>

            {errorMessage && <div className="error">{errorMessage}</div>}

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
            />

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add User'}
            </button>
        </form>
    )
}