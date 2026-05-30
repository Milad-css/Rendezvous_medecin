import { useState, useEffect } from "react"
import api from "../services/api"
import { useSelector } from "react-redux"
const MEDECIN_ID = 6

function GestionCreneau() {
    const [creneaux, setCreneaux] = useState([])
    const [formData, setFormData] = useState({ date: '', heure_debut: '', heure_fin: '' })
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("success")
    const userId = useSelector((state) => state.auth.user.id)
    const [medecinId, setMedecinId] = useState(null)

    useEffect(() => {
        api.get(`/medecin/user/${userId}`)
           .then((res) => setMedecinId(res.data.id))
           .catch((err) => console.log(err))
    } , [])

    const fetchCreneaux = () => {
        api.get(`/creneaux/${medecinId}`)
            .then((res) => setCreneaux(res.data))
            .catch((err) => console.log(err))
    }

    useEffect(() => { if (medecinId) fetchCreneaux() }, [medecinId])

    const showMessage = (msg, type = "success") => {
        setMessage(msg)
        setMessageType(type)
        setTimeout(() => setMessage(""), 3000)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleAjouter = () => {
        if (!formData.date || !formData.heure_debut || !formData.heure_fin) {
            showMessage("Veuillez remplir tous les champs", "error")
            return
        }
        api.post("/creneau/creer", { ...formData, medecin_id: medecinId })
            .then(() => {
                showMessage("Créneau ajouté avec succès !")
                setFormData({ date: '', heure_debut: '', heure_fin: '' })
                fetchCreneaux()
            })
            .catch(() => showMessage("Erreur lors de l'ajout", "error"))
    }

    const handleSupprimer = (id) => {
        api.delete(`/creneau/supprimer/${id}`)
            .then(() => { showMessage("Créneau supprimé !"); fetchCreneaux() })
            .catch(() => showMessage("Erreur lors de la suppression", "error"))
    }   

    return (
        <div style={styles.container}>

            {/* Formulaire ajout */}
            <div style={styles.card}>
                <h2 style={styles.title}>Ajouter un Créneau</h2>

                {message && (
                    <div style={{
                        ...styles.alert,
                        backgroundColor: messageType === "success" ? "#e8f8f0" : "#fdecea",
                        color: messageType === "success" ? "#1a8a4a" : "#c0392b",
                        borderLeft: `4px solid ${messageType === "success" ? "#27ae60" : "#e74c3c"}`,
                    }}>
                        {messageType === "success" ? "" : ""} {message}
                    </div>
                )}

                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Date</label>
                        <input name="date" type="date" value={formData.date}
                            onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Heure début</label>
                        <input name="heure_debut" type="time" value={formData.heure_debut}
                            onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Heure fin</label>
                        <input name="heure_fin" type="time" value={formData.heure_fin}
                            onChange={handleChange} style={styles.input} />
                    </div>
                </div>

                <button onClick={handleAjouter} style={styles.addBtn}>
                     Ajouter le créneau
                </button>
            </div>

            {/* Liste des créneaux */}
            <div style={styles.card}>
                <h2 style={styles.title}>Liste des Créneaux</h2>

                {creneaux.length === 0 ? (
                    <div style={styles.empty}> Aucun créneau disponible</div>
                ) : (
                    <div style={styles.grid}>
                        {creneaux.map((c) => (
                            <div key={c.id} style={styles.creneauCard}>
                                <div>
                                    <p style={styles.creneauDate}> {c.date}</p>
                                    <p style={styles.creneauInfo}> {c.heure_debut} → {c.heure_fin}</p>
                                </div>
                                <button onClick={() => handleSupprimer(c.id)} style={styles.deleteBtn}>
                                    Supprimer
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e8edf3' },
    title: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
    alert: { padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '500' },
    formRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
    formGroup: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' },
    label: { fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' },
    input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #dde3ec', fontSize: '14px', outline: 'none' },
    addBtn: { backgroundColor: '#1a6fba', color: '#fff', padding: '11px 24px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' },
    grid: { display: 'flex', flexDirection: 'column', gap: '12px' },
    creneauCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '10px', border: '1px solid #e8edf3', backgroundColor: '#f8fafc' },
    creneauDate: { fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
    creneauInfo: { fontSize: '13px', color: '#64748b' },
    deleteBtn: { backgroundColor: '#fff0f0', color: '#e74c3c', border: '1px solid #fdd', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    empty: { color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px' },
}

export default GestionCreneau