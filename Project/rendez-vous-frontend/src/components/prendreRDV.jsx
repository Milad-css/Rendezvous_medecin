import { useEffect, useState } from "react"
import api from "../services/api"

const MEDECIN_ID = 1

function PrendreRDV() {
    const [creneaux, setCreneaux] = useState([])
    const [services, setServices] = useState([])
    const [selectedService, setSelectedService] = useState("")
    const [selectedCreneau, setSelectedCreneau] = useState("")
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("success")

    const fetchCreneaux = () => {
        api.get(`/creneaux/${MEDECIN_ID}`).then((res) => setCreneaux(res.data)).catch(() => {})
    }

    useEffect(() => {
        api.get(`/services/${MEDECIN_ID}`).then((res) => setServices(res.data)).catch(() => {})
        fetchCreneaux()
    }, [])

    const showMessage = (msg, type = "success") => {
        setMessage(msg)
        setMessageType(type)
        setTimeout(() => setMessage(""), 3000)
    }

    const handlePrendreRdv = () => {
        if (!selectedService || !selectedCreneau) {
            showMessage("Veuillez choisir un service et un créneau", "error")
            return
        }

        api.post("/rendez-vous/prendre", {
            service_id: selectedService,
            creneau_id: selectedCreneau,
        })
            .then(() => {
                showMessage("Rendez-vous confirmé avec succès !")
                setSelectedCreneau("")
                setSelectedService("")
                fetchCreneaux()
            })
            .catch(() => showMessage("Erreur lors de la prise de rendez-vous", "error"))
    }

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Prendre un Rendez-vous</h2>

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

            <div style={styles.formGroup}>
                <label style={styles.label}>Service médical</label>
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} style={styles.select}>
                    <option value="">-- Sélectionner un service --</option>
                    {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.nom} — {s.prix} DH ({s.duree} min)</option>
                    ))}
                </select>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Créneau disponible</label>
                <select value={selectedCreneau} onChange={(e) => setSelectedCreneau(e.target.value)} style={styles.select}>
                    <option value="">-- Sélectionner un créneau --</option>
                    {creneaux.map((c) => (
                        <option key={c.id} value={c.id}>{c.date} à {c.heure_debut}</option>
                    ))}
                </select>
            </div>

            <button onClick={handlePrendreRdv} style={styles.btn}>
                 Confirmer le rendez-vous
            </button>
        </div>
    )
}

const styles = {
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e8edf3', maxWidth: '600px' },
    title: { fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' },
    alert: { padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
    select: { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #dde3ec', fontSize: '14px', outline: 'none', backgroundColor: '#fff', color: '#1e293b' },
    btn: { backgroundColor: '#1a6fba', color: '#fff', padding: '13px 28px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
}

export default PrendreRDV