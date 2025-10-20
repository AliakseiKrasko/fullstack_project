import { useState } from 'react';
import { useAddProductMutation } from '../services/usersApi';

export const ProductForm = () => {
    const [addProduct, { isLoading }] = useAddProductMutation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !price.trim()) return alert('Введите название и цену');

        try {
            await addProduct({
                name,
                description,
                price: parseFloat(price),
                image_url: imageUrl || '/uploads/default.jpg',
            }).unwrap();

            setName('');
            setDescription('');
            setPrice('');
            setImageUrl('');
            alert('✅ Product added successfully!');
        } catch (err) {
            console.error('Error adding product:', err);
            alert('❌ Failed to add product');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h2>Add New Product</h2>

            <input
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
            />

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
            />

            <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isLoading}
            />

            <input
                type="text"
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isLoading}
            />

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Product'}
            </button>
        </form>
    );
};
