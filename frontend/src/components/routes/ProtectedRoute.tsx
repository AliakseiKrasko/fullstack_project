import { Navigate } from 'react-router-dom'
import { notifyError } from '../../utils/alerts'
import type {JSX} from 'react';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token')
    if (!token) {
        notifyError('🔒 Please log in first')
        return <Navigate to="/auth" replace />
    }
    return children
}