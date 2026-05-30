import { Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Medecin from "./pages/medecin"
import Secretaire from "./pages/secretaire"
import ProtectedRoutes from "./Routes/protectedRoutes"

function App() {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
                <ProtectedRoutes role="patient">
                    <Dashboard />
                </ProtectedRoutes>
            } />

            <Route path="/dashboard/medecin" element={
                <ProtectedRoutes role="medecin">
                    <Medecin />
                </ProtectedRoutes>
            } />

            <Route path="/dashboard/secretaire" element={
                <ProtectedRoutes role="secretaire">
                    <Secretaire />
                </ProtectedRoutes>
            } />

            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    )
}

export default App