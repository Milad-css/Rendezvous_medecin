
import { useEffect,useState } from "react"
import api from "../services/api"

function ListePatients(){
    const [patients,setPatient] = useState([])
    useEffect(()=>{
        api.get("/secretaire/patients")
           .then((res) => setPatient(res.data))
           .catch((err) => console.log(err))
    },[])
 

    return (
           <div style={styles.container}>
            <h2 style={styles.title}>Liste des Patients</h2>

            {patients.length === 0 ? (
                <div style={styles.empty}> Aucun patient trouvé</div>
            ) : (
                <div style={styles.grid}>
                    {patients.map((p) => (
                        <div key={p.id} style={styles.card}>
                            <div style={styles.avatar}>
                                {p.nom?.charAt(0)}{p.prenom?.charAt(0)}
                            </div>
                            <div>
                                <p style={styles.name}>{p.nom} {p.prenom}</p>
                                <p style={styles.info}> {p.email}</p>
                                <p style={styles.info}> {p.telephone}</p>
                            </div>
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
    empty: { backgroundColor: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '16px', border: '1px solid #e8edf3' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e8edf3', display: 'flex', alignItems: 'center', gap: '16px' },
    avatar: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#1a6fba', color: '#fff', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    name: { fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
    info: { fontSize: '13px', color: '#64748b', marginBottom: '2px' },
}
export default ListePatients