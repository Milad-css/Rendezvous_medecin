import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/AuthSlice'
import ListePatients from '../components/listePatient'
import ListeRDV from '../components/listeRDV'
import api from '../services/api'
import '../Dashboard.css'
import ProfilSecretaire from '../components/profilSecretaire'

function Secretaire() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [pages, setPages] = useState("Patients")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout = () => {
        api.post("/logout")
            .then(() => { dispatch(logout()); navigate("/login") })
            .catch(() => { dispatch(logout()); navigate("/login") })
    }

    const handleNav = (p) => {
        setPages(p)
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
                    <span className="user-role">Secrétaire</span>
                </div>

                <div className="divider" />

                <button onClick={() => handleNav("profil")} className={`nav-btn ${pages === "profil" ? "active" : ""}`}>
                    Profil
                </button>

                <button onClick={() => handleNav("Patients")} className={`nav-btn ${pages === "Patients" ? "active" : ""}`}>
                     Liste des Patients
                </button>

                <button onClick={() => handleNav("rendez-vous")} className={`nav-btn ${pages === "rendez-vous" ? "active" : ""}`}>
                     Tous les RDV
                </button>

                <button onClick={handleLogout} className="logout-btn">
                     Déconnexion
                </button>
            </aside>

            <main className="main">
                {pages === "profil" && <ProfilSecretaire />}
                {pages === "Patients" && <ListePatients />}
                {pages === "rendez-vous" && <ListeRDV />}
                
            </main>

        </div>
    )
}

export default Secretaire