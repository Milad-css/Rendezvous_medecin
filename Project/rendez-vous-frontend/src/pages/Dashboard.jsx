import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/AuthSlice'
import PrendreRDV from '../components/prendreRDV'
import MesRendezVous from '../components/mesRDV'
import Profil from '../components/profil'
import api from '../services/api'
import '../Dashboard.css'

function Dashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [page, setPage] = useState("Profil")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout = () => {
        api.post("/logout")
            .then(() => { dispatch(logout()); navigate("/login") })
            .catch(() => { dispatch(logout()); navigate("/login") })
    }

    const handleNav = (p) => {
        setPage(p)
        setSidebarOpen(false)
    }

    return (
        <div className="container">

            {/* Burger button mobile */}
            <button className="burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="0" y1="1" x2="18" y2="1"/><line x1="0" y1="7" x2="18" y2="7"/><line x1="0" y1="13" x2="18" y2="13"/>
                </svg>
            </button>

            {/* Overlay mobile */}
            <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="logo">
                    <span className="logo-icon">RV</span>
                    <span className="logo-text">RendezVous</span>
                </div>

                <div className="user-info">
                    <div className="avatar">
                        {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
                    </div>
                    <p className="user-name">{user?.nom} {user?.prenom}</p>
                    <span className="user-role">Patient</span>
                </div>

                <div className="divider" />

                <button onClick={() => handleNav("Profil")} className={`nav-btn ${page === "Profil" ? "active" : ""}`}>
                     Mon Profil
                </button>

                <button onClick={() => handleNav("mesRDV")} className={`nav-btn ${page === "mesRDV" ? "active" : ""}`}>
                     Mes Rendez-vous
                </button>

                <button onClick={() => handleNav("prendreRDV")} className={`nav-btn ${page === "prendreRDV" ? "active" : ""}`}>
                     Prendre un RDV
                </button>

                <button onClick={handleLogout} className="logout-btn">
                     Déconnexion
                </button>
            </aside>

            {/* Contenu */}
            <main className="main">
                {page === "Profil" && <Profil />}
                {page === "mesRDV" && <MesRendezVous />}
                {page === "prendreRDV" && <PrendreRDV />}
            </main>

        </div>
    )
}

export default Dashboard