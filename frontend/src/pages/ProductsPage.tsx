import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import {
    useGetProductsQuery,
    useAddOrderMutation,
    useDeleteProductMutation,
    useUpdateProductMutation,
} from '../services/usersApi'
import type { Product } from '../types/user.types'
import { ProductForm } from '../components/ProductForm'
import {
    notifyError,
    notifySuccess,
    notifyInfo,
    confirmAction,
} from '../utils/alerts'

export const ProductsPage = () => {
    const { data: products, isLoading, error } = useGetProductsQuery()
    const [addOrder] = useAddOrderMutation()
    const [deleteProduct] = useDeleteProductMutation()
    const [updateProduct] = useUpdateProductMutation()

    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const isAuth = Boolean(token)

    // 🧩 Извлекаем userId из токена
    let userId: number | null = null
    if (token) {
        try {
            const decoded = jwtDecode<{ id: number }>(token)
            userId = decoded.id
        } catch {
            console.error('Invalid token')
        }
    }

    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
    })

    // 🛒 Добавление в корзину
    const handleAddToCart = async (product: Product) => {
        if (!isAuth || !userId) {
            notifyInfo('⚠ Please log in to buy products!')
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
            notifySuccess(`${product.name} added to cart!`)
        } catch (err) {
            console.error('Error adding to cart:', err)
            notifyError('❌ Failed to add to cart')
        }
    }

    // 🗑 Удаление товара
    const handleDeleteProduct = async (id: number) => {
        if (role !== 'admin') {
            notifyError('🚫 Only admin can delete products!')
            return
        }

        const confirmed = await confirmAction('Are you sure you want to delete this product?')
        if (!confirmed) return

        try {
            await deleteProduct(id).unwrap()
            notifySuccess('✅ Product deleted successfully!')
        } catch (err) {
            console.error('Error deleting product:', err)
            notifyError('❌ Failed to delete product')
        }
    }

    const startEdit = (product: Product) => {
        setEditingProduct(product)
        setEditForm({
            name: product.name,
            description: product.description,
            price: String(product.price),
            image_url: product.image_url,
        })
    }

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value })
    }

    const saveEdit = async () => {
        if (!editingProduct) return
        try {
            await updateProduct({
                id: editingProduct.id,
                ...editForm,
                price: Number(editForm.price),
            }).unwrap()
            setEditingProduct(null)
            notifySuccess('✅ Product updated successfully!')
        } catch (err) {
            console.error('Error updating product:', err)
            notifyError('❌ Failed to update product')
        }
    }

    if (isLoading) return <p>Loading products...</p>
    if (error) return <p style={{ color: 'red' }}>Error loading products</p>

    return (
        <div className="products-page">
            <h2>Products</h2>

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

                            {role === 'admin' && (
                                <>
                                    <button className="edit-btn" onClick={() => startEdit(p)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>

                        {editingProduct?.id === p.id && (
                            <div className="edit-form">
                                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} />
                                <input type="text" name="description" value={editForm.description} onChange={handleEditChange} />
                                <input type="number" name="price" value={editForm.price} onChange={handleEditChange} />
                                <input type="text" name="image_url" value={editForm.image_url} onChange={handleEditChange} />
                                <button onClick={saveEdit}>Save</button>
                                <button onClick={() => setEditingProduct(null)}>Cancel</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}