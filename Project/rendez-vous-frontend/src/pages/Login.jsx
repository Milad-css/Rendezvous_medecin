import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setCredentials } from '../store/slices/AuthSlice'
import api from '../services/api'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [errors, setErrors] = useState([])
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = []

        if (!formData.email || !formData.password) {
            newErrors.push('Veuillez remplir tous les champs')
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.push('Email invalide')
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.push('Mot de passe doit contenir au moins 6 caractères')
        }

        if (newErrors.length > 0) {
            setErrors(newErrors)
            return
        }

        api.post('/login', formData)
            .then((res) => {
                dispatch(setCredentials({
                    user: res.data.user,
                    token: res.data.token,
                }))
                setFormData({ email: '', password: '' })
                setErrors([])

                const role = res.data.user.role
                if (role === 'medecin') navigate('/dashboard/medecin')
                else if (role === 'secretaire') navigate('/dashboard/secretaire')
                else navigate('/dashboard')
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    setErrors(["L'email ou le mot de passe est incorrect"])
                } else {
                    setErrors(['Une erreur est survenue, veuillez réessayer'])
                }
            })
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Connexion</h1>

                {errors.length > 0 && (
                    <div style={styles.alertError}>
                        {errors.map((err, index) => (
                            <p key={index} style={{ margin: '4px 0' }}>{err}</p>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Votre mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Se connecter
                    </button>
                </form>

                <p style={styles.bottomText}>
                    Pas de compte ? <Link to="/register" style={styles.link}>S'inscrire</Link>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f4f8 50%, #eef2ff 100%)' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(26,111,186,0.12)', width: '100%', maxWidth: '400px', borderTop: '4px solid #1a6fba' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', textAlign: 'center' },
    subtitle: { fontSize: '14px', color: '#94a3b8', textAlign: 'center', marginBottom: '24px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' },
    input: { padding: '11px 14px', borderRadius: '8px', border: '1px solid #dde3ec', fontSize: '14px', outline: 'none', transition: 'border-color 0.18s', backgroundColor: '#fafbfc' },
    alertError: { backgroundColor: '#fdecea', color: '#e74c3c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', borderLeft: '3px solid #e74c3c' },
    button: { background: 'linear-gradient(135deg, #2196f3, #1a6fba)', color: '#fff', padding: '13px', borderRadius: '9px', border: 'none', fontSize: '15px', fontWeight: '600', marginTop: '4px', cursor: 'pointer', letterSpacing: '0.3px' },
    bottomText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#7f8c8d' },
    link: { color: '#1a6fba', textDecoration: 'none', fontWeight: '600' },
}

export default Login