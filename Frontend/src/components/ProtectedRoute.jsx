import { Navigate } from "react-router-dom"

const ProtectedRoutes = ({ role, children, user, isLoading }) => {

    if (isLoading) {
        return <h1>Loagind...</h1>
    }

    if (!user) {
        return <Navigate to={"/signin"} replace />
    }

    if (role && user?.role.trim() !== role) {
        return <Navigate to={"/unauthorized"} replace />
    }

    return children

}

export default ProtectedRoutes