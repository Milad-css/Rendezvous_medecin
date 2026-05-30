import { useState, useEffect } from "react"
import api from "../services/api"
import { useSelector } from "react-redux"


function GererService() {
    const [services, setServices] = useState([])
    const [formData, setFormData] = useState({ nom: '', duree: '', prix: '' })
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("success")
    const userId = useSelector((state) => state.auth.user.id)
    const [medecinId, setMedecinId] = useState(null)

    useEffect(() => {
        api.get(`/medecin/user/${userId}`)
           .then((res) => setMedecinId(res.data.id))
           .catch((err) => console.log(err))
    } , [])

    const fetchServices = () => {
        api.get(`/services/${medecinId}`)
            .then((res) => setServices(res.data))
            .catch(() => {})
    }

    useEffect(() => { if (medecinId) fetchServices() }, [medecinId])

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
        if (!formData.nom || !formData.duree || !formData.prix) {
            showMessage("Veuillez remplir tous les champs", "error")
            return
        }
        api.post("/service/creer", { ...formData, medecin_id: medecinId })
            .then(() => {
                showMessage("Service ajouté avec succès !")
                setFormData({ nom: '', duree: '', prix: '' })
                fetchServices()
            })
            .catch(() => showMessage("Erreur lors de l'ajout", "error"))
    }

    const handleSupprimer = (id) => {
        api.delete(`/service/supprimer/${id}`)
            .then(() => { showMessage("Service supprimé !"); fetchServices() })
            .catch(() => showMessage("Erreur lors de la suppression", "error"))
    }

    return (
        <div style={styles.container}>

            {/* Formulaire ajout */}
            <div style={styles.card}>
                <h2 style={styles.title}>Ajouter un Service</h2>

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
                        <label style={styles.label}>Nom du service</label>
                        <input name="nom" placeholder="Ex: Consultation" value={formData.nom}
                            onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Durée (min)</label>
                        <input name="duree" type="number" placeholder="30" value={formData.duree}
                            onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Prix (DH)</label>
                        <input name="prix" type="number" placeholder="100" value={formData.prix}
                            onChange={handleChange} style={styles.input} />
                    </div>
                </div>

                <button onClick={handleAjouter} style={styles.addBtn}>
                     Ajouter le service
                </button>
            </div>

            {/* Liste des services */}
            <div style={styles.card}>
                <h2 style={styles.title}>Liste des Services</h2>

                {services.length === 0 ? (
                    <div style={styles.empty}> Aucun service trouvé</div>
                ) : (
                    <div style={styles.grid}>
                        {services.map((s) => (
                            <div key={s.id} style={styles.serviceCard}>
                                <div>
                                    <p style={styles.serviceName}>{s.nom}</p>
                                    <p style={styles.serviceInfo}>{s.duree} min &nbsp;·&nbsp; {s.prix} DH</p>
                                </div>
                                <button onClick={() => handleSupprimer(s.id)} style={styles.deleteBtn}>
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
    serviceCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '10px', border: '1px solid #e8edf3', backgroundColor: '#f8fafc' },
    serviceName: { fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
    serviceInfo: { fontSize: '13px', color: '#64748b' },
    deleteBtn: { backgroundColor: '#fff0f0', color: '#e74c3c', border: '1px solid #fdd', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    empty: { color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px' },
}

export default GererService