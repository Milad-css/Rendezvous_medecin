import { useState, useEffect } from "react"
import api from "../services/api"

function MesRendezVous() {
    const [rendezVous, setRendezVous] = useState([])
    const [message, setMessage] = useState("")

    useEffect(() => {
        api.get("/rendez-vous")
            .then((res) => setRendezVous(res.data))
            .catch((err) => console.log(err))
    }, [])

    const handleAnnuler = (id) => {
        api.put(`/rendez-vous/annuler/${id}`)
            .then(() => {
                setMessage("Rendez-vous annulé avec succès !")
                api.get("/rendez-vous").then((res) => setRendezVous(res.data))
                setTimeout(() => setMessage(""), 3000)
            })
            .catch(() => setMessage("Erreur lors de l'annulation"))
    }

    const statusStyle = (status) => {
        if (status === 'confirme') return { backgroundColor: '#e8f8f0', color: '#1a8a4a' }
        if (status === 'annule') return { backgroundColor: '#fdecea', color: '#c0392b' }
        return { backgroundColor: '#fef3e2', color: '#d68910' }
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Mes Rendez-vous</h2>

            {message && (
                <div style={styles.alert}>{message}</div>
            )}

            {rendezVous.length === 0 ? (
                <div style={styles.empty}>
                    <p> Aucun rendez-vous trouvé</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {rendezVous.map((rdv) => (
                        <div key={rdv.id} style={styles.card}>
                            <div style={styles.cardTop}>
                                <p style={styles.service}>{rdv.service?.nom}</p>
                                <span style={{ ...styles.badge, ...statusStyle(rdv.status) }}>
                                    {rdv.status === 'en_attente' ? ' En attente' : rdv.status === 'confirme' ? ' Confirmé' : ' Annulé'}
                                </span>
                            </div>
                            <p style={styles.info}> {rdv.creneau?.date}</p>
                            <p style={styles.info}> {rdv.creneau?.heure_debut}</p>
                            {rdv.status === 'en_attente' && (
                                <button onClick={() => handleAnnuler(rdv.id)} style={styles.annulerBtn}>
                                    Annuler
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: { maxWidth: '800px' },
    title: { fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' },
    alert: { backgroundColor: '#e8f8f0', color: '#1a8a4a', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', borderLeft: '4px solid #27ae60' },
    empty: { backgroundColor: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '16px', border: '1px solid #e8edf3' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e8edf3' },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    service: { fontSize: '16px', fontWeight: '700', color: '#1e293b' },
    badge: { fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' },
    info: { fontSize: '13px', color: '#64748b', marginBottom: '4px' },
    annulerBtn: { width: '100%', backgroundColor: '#fff0f0', color: '#e74c3c', border: '1px solid #fdd', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginTop: '12px' },
}

export default MesRendezVous