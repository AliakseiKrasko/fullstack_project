import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import React from 'react'
import ReactStars from 'react-rating-stars-component'
import { notifyError, notifySuccess } from '../utils/alerts.ts'

const MySwal = withReactContent(Swal)

// 🔧 Функция обновления рейтинга
const handleRatingChange = async (id: number, newRating: number) => {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}/rating`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: newRating }),
        })

        if (!response.ok) throw new Error('Failed to update rating')
        notifySuccess(`⭐ Rating updated to ${newRating}`)
    } catch (error) {
        console.error('Error updating rating:', error)
        notifyError('❌ Failed to update rating')
    }
}

interface ProductDetails {
    id: number
    name: string
    description?: string
    price: number
    image_url?: string
    rating?: number
}

// 🪟 Просмотр деталей товара
export const showProductDetails = (product: ProductDetails) => {
    const rating = product.rating || 4.0

    MySwal.fire({
        title: `<strong>${product.name}</strong>`,
        html: `
            <div style="
                display: flex;
                flex-direction: row;
                gap: 20px;
                align-items: flex-start;
                justify-content: center;
            ">
                <!-- Левая колонка -->
                <div style="flex: 1; text-align: center;">
                    <img 
                        src="http://localhost:3000${product.image_url}" 
                        alt="${product.name}" 
                        style="width: 250px; height: 250px; object-fit: contain; border-radius: 8px; background: #fff; padding: 8px;"
                    />
                    <p style="font-size: 18px; color: #2ecc71; font-weight: bold; margin-top: 12px;">
                        💰 $${product.price}
                    </p>
                    <div id="rating-stars" style="margin-top: 10px;"></div>
                </div>

                <!-- Правая колонка -->
                <div style="flex: 1; text-align: left;">
                    <p style="margin-top: 8px; font-size: 15px; color: #ddd; line-height: 1.5;">
                        ${product.description || 'No description available'}
                    </p>
                </div>
            </div>
        `,
        showConfirmButton: false,
        background: '#1e1e2f',
        color: '#fff',
        width: 700,
        didOpen: () => {
            const container = document.getElementById('rating-stars')
            if (container) {
                const stars = React.createElement(ReactStars, {
                    count: 5,
                    size: 30,
                    value: rating,
                    edit: true,
                    isHalf: true,
                    activeColor: '#ffd700',
                    onChange: (newRating: number) =>
                        handleRatingChange(product.id, newRating),
                })
                import('react-dom/client').then((ReactDOM) => {
                    const root = ReactDOM.createRoot(container!)
                    root.render(stars)
                })
            }
        },
    })
}