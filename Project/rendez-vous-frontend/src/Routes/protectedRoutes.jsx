import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function ProtectedRoutes({ children, role }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth)

    console.log('isAuthenticated:', isAuthenticated)
    console.log('user role:', user?.role)
    console.log('required role:', role)

    if (!isAuthenticated) return <Navigate to="/login" />
    if (role && user.role !== role) return <Navigate to="/login" />

    return children
}

export default ProtectedRoutes