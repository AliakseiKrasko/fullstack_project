import { useState } from 'react'
import { useCreateUserMutation } from '../services/usersApi'

export const UserForm = () => {
    const [createUser, { isLoading, error }] = useCreateUserMutation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [validationError, setValidationError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setValidationError('')

        if (!name.trim() || !email.trim()) {
            setValidationError('All fields are required')
            return
        }

        try {
            await createUser({ name, email }).unwrap()
            setName('')
            setEmail('')
        } catch (err) {
            console.error('Failed to create user:', err)
        }
    }

    const getErrorMessage = () => {
        if (validationError) return validationError
        if (error && 'data' in error) {
            return (error as any).data?.message || 'Failed to create user'
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