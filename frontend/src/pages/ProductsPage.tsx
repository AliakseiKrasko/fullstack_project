import { useGetProductsQuery, useAddOrderMutation } from '../services/usersApi'
import type { Product } from '../types/user.types'

export const ProductsPage = ({ userId }: { userId: number }) => {
    const { data: products, isLoading, error } = useGetProductsQuery(undefined)
    const [addOrder] = useAddOrderMutation()

    const handleAddToCart = async (product: Product) => {
        try {
            await addOrder({
                user_id: userId,
                product_name: product.name,
                amount: product.price,
            }).unwrap()
            alert(`✅ ${product.name} added to cart!`)
        } catch (err) {
            console.error('Error adding to cart:', err)
        }
    }

    if (isLoading) return <p>Loading products...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading products</p>

    return (
        <div className="products-page">
            <h2>Products</h2>
            <ul>
                {products?.map((p: Product) => (
                    <li key={p.id}>
                        <strong>{p.name}</strong> — ${p.price}
                        <p>{p.description}</p>
                        <button onClick={() => handleAddToCart(p)}>
                            Add to Cart
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}