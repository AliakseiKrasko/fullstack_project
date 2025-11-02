import {jwtDecode} from 'jwt-decode'
import type {Product} from '../../types/user.types.ts'
import {ProductForm} from '../../components/ProductForm.tsx'
import {confirmAction, notifyError, notifyInfo, notifySuccess} from '../../utils/alerts.ts'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {
    useAddOrderMutation,
    useDeleteProductMutation,
    useGetProductsQuery,
    useUpdateProductMutation, useUpdateProductRatingMutation
} from '../../services/usersApi.ts';
import ReactStars from 'react-rating-stars-component';
import {showProductDetails} from '../../components/ProductDetailsModal.tsx';
import './ProductsPage.css'


const MySwal = withReactContent(Swal)

export const ProductsPage = () => {
    const { data: products, isLoading, error, refetch } = useGetProductsQuery()
    const [addOrder] = useAddOrderMutation()
    const [deleteProduct] = useDeleteProductMutation()
    const [updateProduct] = useUpdateProductMutation()
    const [updateProductRating] = useUpdateProductRatingMutation()

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
                product_id: product.id,
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
            notifySuccess('Product deleted successfully!')
        } catch (err) {
            console.error('Error deleting product:', err)
            notifyError('❌ Failed to delete product')
        }
    }

    // ✏️ Редактирование товара
    const handleEditProduct = (product: Product) => {
        MySwal.fire({
            title: `Edit Product: ${product.name}`,
            html: `
                <input id="name" class="swal2-input" placeholder="Name" value="${product.name}">
                <input id="description" class="swal2-input" placeholder="Description" value="${product.description}">
                <input id="price" type="number" step="0.01" class="swal2-input" placeholder="Price" value="${product.price}">
                <input id="image_url" class="swal2-input" placeholder="Image URL" value="${product.image_url}">
            `,
            showCancelButton: true,
            confirmButtonText: '💾 Save',
            cancelButtonText: 'Cancel',
            background: '#1a1a2e',
            color: '#fff',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            width: 500,
            preConfirm: () => {
                const name = (document.getElementById('name') as HTMLInputElement).value.trim()
                const description = (document.getElementById('description') as HTMLInputElement).value.trim()
                const price = parseFloat((document.getElementById('price') as HTMLInputElement).value)
                const image_url = (document.getElementById('image_url') as HTMLInputElement).value.trim()

                if (!name || !description || !price || !image_url) {
                    Swal.showValidationMessage('⚠ Please fill in all fields correctly')
                    return false
                }

                return { name, description, price, image_url }
            },
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    await updateProduct({
                        id: product.id,
                        ...result.value,
                    }).unwrap()
                    notifySuccess('Product updated successfully!')
                } catch {
                    notifyError('❌ Failed to update product')
                }
            }
        })
    }

    // ⭐ Изменение рейтинга
    const handleRatingChange = async (id: number, newRating: number) => {
        try {
            await updateProductRating({ id, rating: newRating }).unwrap()
            notifySuccess('⭐ Rating updated!')
            refetch() // ✅ обновляем список товаров после изменения рейтинга
        } catch {
            notifyError('❌ Failed to update rating')
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
                    <li
                        key={p.id}
                        className="product-card"
                        onClick={() =>
                            showProductDetails({
                                id: p.id,
                                name: p.name,
                                price: p.price,
                                image_url: p.image_url,
                                description: p.description,
                                rating: p.rating, // ✅ корректное поле
                            })
                        }
                        style={{cursor: 'pointer'}}
                    >
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
                        <p>
                            {p.description
                                ? p.description.split(' ').slice(0, 3).join(' ') +
                                (p.description.split(' ').length > 3 ? '…' : '')
                                : ''}
                        </p>

                        <ReactStars
                            count={5}
                            size={24}
                            value={p.rating || 4.0}
                            edit={true}
                            isHalf={true}
                            activeColor="#ffd700"
                            onChange={(newRating) => handleRatingChange(p.id, newRating)}
                        />

                        <div className="product-buttons">
                            {role !== 'admin' && (
                                <button
                                    className="add-btn"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAddToCart(p)
                                    }}
                                >
                                    Add to Cart
                                </button>
                            )}
                            {role === 'admin' && (
                                <>
                                    <button
                                        className="edit-btn"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditProduct(p)
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteProduct(p.id)
                                        }}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}