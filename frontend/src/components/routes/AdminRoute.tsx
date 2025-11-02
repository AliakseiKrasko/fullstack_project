import { Navigate } from 'react-router-dom'
import { notifyError } from '../../utils/alerts'
import type {JSX} from 'react';

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') {
        notifyError('🚫 Access denied. Admins only.')
        return <Navigate to="/products" replace />
    }
    return children
}