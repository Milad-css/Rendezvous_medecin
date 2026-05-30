import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/AuthSlice'
import ProfilMedecin from '../components/ProfilMedecin'
import GererService from '../components/GererService'
import GestionCreneau from '../components/GestionCreneau'
import ListeRDV from '../components/listeRDV'
import api from '../services/api'
import '../Dashboard.css'
import CreerSecretaire from '../components/CreerSecretaire'
import Calendrier from '../components/calendrier'

function DashboardMedecin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [page, setPage] = useState("profil")
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

            <button className="burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="0" y1="1" x2="18" y2="1"/><line x1="0" y1="7" x2="18" y2="7"/><line x1="0" y1="13" x2="18" y2="13"/>
                </svg>
            </button>

            <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

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
                    <span className="user-role">Médecin</span>
                </div>

                <div className="divider" />

                <button onClick={() => handleNav("calendrier")} className={`nav-btn ${page === "calendrier" ? "active" : ""}`}>
                    Calendrier
                </button>

                <button onClick={() => handleNav("profil")} className={`nav-btn ${page === "profil" ? "active" : ""}`}>
                     Mon Profil
                </button>

                <button onClick={() => handleNav("services")} className={`nav-btn ${page === "services" ? "active" : ""}`}>
                     Gérer les Services
                </button>

                <button onClick={() => handleNav("creneaux")} className={`nav-btn ${page === "creneaux" ? "active" : ""}`}>
                     Gérer les Créneaux
                </button>

                <button onClick={() => handleNav("rdv")} className={`nav-btn ${page === "rdv" ? "active" : ""}`}>
                     Tous les RDV
                </button>
                <button onClick={() => handleNav("creer")} className={`nav-btn ${page === "creer" ? "active" : ""}`}>
                     creer un compte secretaire 
                </button>

                <button onClick={handleLogout} className="logout-btn">
                     Déconnexion
                </button>
            </aside>

            <main className="main">
                {page === "calendrier" && <Calendrier />}
                {page === "profil" && <ProfilMedecin />}
                {page === "services" && <GererService />}
                {page === "creneaux" && <GestionCreneau />}
                {page === "rdv" && <ListeRDV />}
                {page === "creer" && <CreerSecretaire />}
                
            </main>

        </div>
    )
}

export default DashboardMedecin