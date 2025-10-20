import { useAddOrderMutation } from '../services/usersApi'
import { useState } from 'react'

interface UsOrdersFormProps {
    userId: number
}

export const UsOrdersForm = ({ userId }: UsOrdersFormProps) => {
    const [product, setProduct] = useState('')
    const [amount, setAmount] = useState('')
    const [addOrder, { isLoading: isAdding, error }] = useAddOrderMutation()

    const handleAddOrder = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!product.trim() || !amount.trim()) return

        try {
            await addOrder({
                user_id: userId,
                product_name: product,
                amount: parseFloat(amount),
            }).unwrap()

            setProduct('')
            setAmount('')
        } catch (err) {
            console.error('Ошибка при добавлении заказа:', err)
        }
    }

    return (
        <form onSubmit={handleAddOrder} className="order-form">
            <input
                type="text"
                placeholder="Product name"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                disabled={isAdding}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isAdding}
            />
            <button type="submit" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add Order'}
            </button>

            {error && <p style={{ color: 'red' }}>Error adding order</p>}
        </form>
    )
}