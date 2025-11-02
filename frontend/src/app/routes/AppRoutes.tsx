import { Routes, Route, Navigate } from 'react-router-dom'
import {AuthPage} from '../../pages/authPage/AuthPage.tsx';
import {AdminRoute} from '../../components/routes/AdminRoute.tsx';
import {UserList} from '../../components/UserList.tsx';
import {UserForm} from '../../components/UserForm.tsx';
import {AdminDashboard} from '../../pages/adminDashboard/AdminDashboard.tsx';
import {ProductsPage} from '../../pages/productsPage/ProductsPage.tsx';
import {ProtectedRoute} from '../../components/routes/ProtectedRoute.tsx';
import {CartPage} from '../../pages/cartPage/CartPage.tsx';


export const AppRoutes = ({ isAdmin }: { isAdmin: boolean }) => (
    <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route
            path="/users"
            element={
                <AdminRoute>
                    <>
                        <UserForm />
                        <UserList />
                    </>
                </AdminRoute>
            }
        />

        <Route
            path="/admin"
            element={
                <AdminRoute>
                    <AdminDashboard />
                </AdminRoute>
            }
        />

        <Route path="/products" element={<ProductsPage />} />

        <Route
            path="/cart"
            element={
                <ProtectedRoute>
                    {isAdmin ? <Navigate to="/products" replace /> : <CartPage />}
                </ProtectedRoute>
            }
        />

        <Route path="/" element={<Navigate to="/products" replace />} />
    </Routes>
)