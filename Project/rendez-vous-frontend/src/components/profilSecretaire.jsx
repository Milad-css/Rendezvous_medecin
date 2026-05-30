import { useState, useEffect } from "react"
import api from "../services/api"
import { useSelector } from "react-redux"

function ProfilSecretaire() {
    const [profil, setProfil] = useState(null)
    const userId = useSelector((state) => state.auth.user.id)
     useEffect(() => {
        
        api.get(`/secretaire/profil/${userId}`)
            .then((res) => setProfil(res.data))
            .catch((err) => console.log(err))
    }, [])
    console.log(profil)

    if (!profil) return <p>Chargement...</p>

    return (
        <div style={styles.card}>
            <div style={styles.profilTop}>
                <div style={styles.avatar}>
                    {profil.nom?.charAt(0)}{profil.prenom?.charAt(0)}
                </div>
                <div>
                    <h2 style={styles.name}>{profil.nom} {profil.prenom}</h2>
                    <p  style={styles.sub}> {profil.email}</p>
                    <p  style={styles.sub}>Medecin :{profil.nom_medecin}  {profil.prenom_medecin}</p>
                </div>
            </div>

           <div style={styles.infoGrid}>
    {[
                    { label: 'Nom', value: profil.nom },
                    { label: 'Prénom', value: profil.prenom },
                    { label: 'Email', value: profil.email },
                    // On combine les deux valeurs en une seule chaîne de caractères
                    { 
                        label: 'Médecin rattaché', 
                        value: `Dr. ${profil.nom_medecin} ${profil.prenom_medecin}` 
                    },
                    ].map((item) => (
                    <div key={item.label} style={styles.infoBox}>
                        <p style={styles.infoLabel}>{item.label}</p>
                        <p style={styles.infoValue}>{item.value || 'Non renseigné'}</p>
            </div>
                ))}
            </div>
        </div>
    )
}

const styles = {
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e8edf3', maxWidth: '700px' },
    profilTop: { display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #f0f0f0' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#1a6fba', color: '#fff', fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' },
    sub: { fontSize: '14px', color: '#64748b', marginBottom: '4px' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    infoBox: { backgroundColor: '#f8fafc', border: '1px solid #e8edf3', padding: '16px', borderRadius: '10px' },
    infoLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' },
    infoValue: { fontSize: '15px', color: '#1e293b', fontWeight: '600' },
}

export default ProfilSecretaire