import { useGetProductsQuery, useAddOrderMutation, useDeleteProductMutation } from '../services/usersApi'
import type { Product } from '../types/user.types'
import { ProductForm } from '../components/ProductForm'

export const ProductsPage = () => {
    const { data: products, isLoading, error } = useGetProductsQuery(undefined)
    const [addOrder] = useAddOrderMutation()
    const [deleteProduct] = useDeleteProductMutation()

    const token = localStorage.getItem('token')
    const userId = Number(localStorage.getItem('userId'))
    const role = localStorage.getItem('role') // ✅ добавлено
    const isAuth = Boolean(token)

    const handleAddToCart = async (product: Product) => {
        if (!isAuth) {
            alert('⚠ Please log in to buy products!')
            window.location.href = '/auth'
            return
        }

        try {
            await addOrder({
                user_id: userId,
                product_name: product.name,
                amount: product.price,
                image_url: product.image_url,
            }).unwrap()

            alert(`✅ ${product.name} added to cart!`)
        } catch (err) {
            console.error('Error adding to cart:', err)
        }
    }

    const handleDeleteProduct = async (id: number) => {
        if (role !== 'admin') {
            alert('🚫 Only admin can delete products!')
            return
        }

        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap()
            } catch (err) {
                console.error('Error deleting product:', err)
                alert('Failed to delete product')
            }
        }
    }

    if (isLoading) return <p>Loading products...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading products</p>

    return (
        <div className="products-page">
            <h2>Products</h2>

            {/* ✅ Форма добавления доступна только админу */}
            {isAuth && role === 'admin' && <ProductForm />}

            <ul className="products-grid">
                {products?.map((p: Product) => (
                    <li key={p.id} className="product-card">
                        <img
                            src={`http://localhost:3000${p.image_url}`}
                            alt={p.name}
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                backgroundColor: '#fff',
                                padding: '8px',
                                marginBottom: '10px',
                            }}
                        />
                        <strong>{p.name}</strong> — ${p.price}
                        <p>{p.description}</p>

                        <div className="product-buttons">
                            <button className="add-btn" onClick={() => handleAddToCart(p)}>
                                Add to Cart
                            </button>

                            {/* ✅ Кнопка удаления доступна только админу */}
                            {role === 'admin' && (
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteProduct(p.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}