import { useState, useEffect } from "react"
import api from "../services/api"

function ListeRDV() {
    const [rendezVous, setRendezVous] = useState([])
    const [message, setMessage] = useState("")

    useEffect(() => {
        api.get("/secretaire/rendez-vous")
            .then((res) => setRendezVous(res.data))
            .catch((err) => console.log(err))
    }, [])

    const showMessage = (msg) => {
        setMessage(msg)
        setTimeout(() => setMessage(""), 3000)
    }

    const handleConfirmer = (id) => {
        api.put(`/secretaire/rendez-vous/confirmer/${id}`)
            .then(() => {
                showMessage("Rendez-vous confirmé !")
                api.get("/secretaire/rendez-vous").then((res) => setRendezVous(res.data))
            })
            .catch(() => showMessage("Erreur lors de la confirmation"))
    }

    const handleAnnuler = (id) => {
        api.put(`/secretaire/rendez-vous/annuler/${id}`)
            .then(() => {
                showMessage("Rendez-vous annulé !")
                api.get("/secretaire/rendez-vous").then((res) => setRendezVous(res.data))
            })
            .catch(() => showMessage("Erreur lors de l'annulation"))
    }

    const statusStyle = (status) => {
        if (status === 'confirme') return { backgroundColor: '#e8f8f0', color: '#1a8a4a' }
        if (status === 'annule') return { backgroundColor: '#fdecea', color: '#c0392b' }
        return { backgroundColor: '#fef3e2', color: '#d68910' }
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Tous les Rendez-vous</h2>

            {message && (
                <div style={styles.alert}>{message}</div>
            )}

            {rendezVous.length === 0 ? (
                <div style={styles.empty}> Aucun rendez-vous trouvé</div>
            ) : (
                <div style={styles.grid}>
                    {rendezVous.map((rdv) => (
                        <div key={rdv.id} style={styles.card}>
                            <div style={styles.cardTop}>
                                <p style={styles.patientName}>
                                     {rdv.patient?.user?.nom} {rdv.patient?.user?.prenom}
                                </p>
                                <span style={{ ...styles.badge, ...statusStyle(rdv.status) }}>
                                    {rdv.status === 'en_attente' ? ' En attente' : rdv.status === 'confirme' ? ' Confirmé' : ' Annulé'}
                                </span>
                            </div>

                            <p style={styles.info}>  {rdv.service?.nom}</p>
                            <p style={styles.info}> {rdv.creneau?.date}</p>
                            <p style={styles.info}> {rdv.creneau?.heure_debut}</p>

                            {rdv.status === 'en_attente' && (
                                <div style={styles.actions}>
                                    <button onClick={() => handleConfirmer(rdv.id)} style={styles.confirmBtn}>
                                         Confirmer
                                    </button>
                                    <button onClick={() => handleAnnuler(rdv.id)} style={styles.cancelBtn}>
                                         Annuler
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: { maxWidth: '900px' },
    title: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
    alert: { backgroundColor: '#e8f8f0', color: '#1a8a4a', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', borderLeft: '4px solid #27ae60' },
    empty: { backgroundColor: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '16px', border: '1px solid #e8edf3' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e8edf3' },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    patientName: { fontSize: '15px', fontWeight: '700', color: '#1e293b' },
    badge: { fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' },
    info: { fontSize: '13px', color: '#64748b', marginBottom: '4px' },
    actions: { display: 'flex', gap: '8px', marginTop: '12px' },
    confirmBtn: { flex: 1, backgroundColor: '#e8f8f0', color: '#1a8a4a', border: '1px solid #27ae60', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    cancelBtn: { flex: 1, backgroundColor: '#fff0f0', color: '#e74c3c', border: '1px solid #fdd', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
}

export default ListeRDV