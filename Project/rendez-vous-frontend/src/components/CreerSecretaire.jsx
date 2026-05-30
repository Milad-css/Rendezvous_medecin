import { useEffect, useState } from "react"
import api from "../services/api"
import { useSelector } from "react-redux"


function CreerSecretaire() {
    const userId = useSelector((state) => state.auth.user.id)
    const [medecinId, setMedecinId] = useState(null)
    useEffect(() => {
        api.get(`/medecin/user/${userId}`)
           .then((res) => setMedecinId(res.data.id))
           .catch((err) => console.log(err))
    } , [])
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState([])
    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors([])
    }

    const validate = () => {
        const newErrors = []
        if (!formData.nom.trim()) newErrors.push('Nom est obligatoire')
        if (!formData.prenom.trim()) newErrors.push('Prénom est obligatoire')
        if (!formData.email.trim()) newErrors.push('Email est obligatoire')
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.push('Email invalide')
        if (!formData.password) newErrors.push('Mot de passe est obligatoire')
        else if (formData.password.length < 6) newErrors.push('Minimum 6 caractères')
        return newErrors
    }

    const handleSubmit = () => {
      
        const newErrors = validate()
        if (newErrors.length > 0) {
            setErrors(newErrors)
            return
        }
        const secretaire = {
            nom : formData.nom,
            prenom : formData.prenom,
            email : formData.email,
            password : formData.password,
            medecin_id : medecinId
        }

        api.post("/secretaire/creer", secretaire)
            .then(() => {
                setMessage("Secrétaire créée avec succès !")
                setFormData({ nom: '', prenom: '', email: '', password: '' })
                setErrors([])
                setTimeout(() => setMessage(""), 3000)
            })
            .catch(() => setErrors(["Une erreur est survenue, veuillez réessayer"]))
        console.log('token:', localStorage.getItem('token'))
        console.log('data envoyée:', secretaire)
    }
        

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Créer un compte Secrétaire</h2>

            {message && (
                <div style={styles.success}> {message}</div>
            )}

            {errors.length > 0 && (
                <div style={styles.alertError}>
                    {errors.map((err, index) => (
                        <p key={index} style={{ margin: '4px 0' }}>{err}</p>
                    ))}
                </div>
            )}

            <div style={styles.row}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Nom</label>
                    <input type="text" name="nom" placeholder="Nom"
                        value={formData.nom} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Prénom</label>
                    <input type="text" name="prenom" placeholder="Prénom"
                        value={formData.prenom} onChange={handleChange} style={styles.input} />
                </div>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input type="email" name="email" placeholder="secretaire@email.com"
                    value={formData.email} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Mot de passe</label>
                <input type="password" name="password" placeholder="Minimum 6 caractères"
                    value={formData.password} onChange={handleChange} style={styles.input} />
            </div>

            <button onClick={handleSubmit} style={styles.btn}>
                 Créer le compte
            </button>
        </div>
    )
}

const styles = {
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e8edf3', maxWidth: '600px' },
    title: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' },
    success: { backgroundColor: '#e8f8f0', color: '#1a8a4a', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', borderLeft: '4px solid #27ae60' },
    alertError: { backgroundColor: '#fdecea', color: '#c0392b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', borderLeft: '4px solid #e74c3c' },
    row: { display: 'flex', gap: '16px' },
    formGroup: { display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '16px' },
    label: { fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' },
    input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #dde3ec', fontSize: '14px', outline: 'none' },
    btn: { backgroundColor: '#1a6fba', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
}

export default CreerSecretaire