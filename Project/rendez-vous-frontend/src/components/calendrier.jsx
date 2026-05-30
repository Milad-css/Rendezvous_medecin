import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import api from "../services/api"

function Calendrier() {
    const [events, setEvents] = useState([])
    const userId = useSelector((state) => state.auth.user.id)

    useEffect(() => {
        api.get(`/medecin/user/${userId}`)
            .then((res) => {
                const id = res.data.id
                api.get("/secretaire/rendez-vous")
                    .then((res) => {
                        console.log(res.data)
                        const rdvs = res.data.map((rdv) => ({
                            id: rdv.id,
                            title: `${rdv.patient?.user?.nom} - ${rdv.service?.nom}`,
                            date: rdv.creneau?.date,
                            start: `${rdv.creneau?.date}T${rdv.creneau?.heure_debut}`,
                            end: `${rdv.creneau?.date}T${rdv.creneau?.heure_fin}`,
                            backgroundColor:
                                rdv.status === 'confirme' ? '#27ae60' :
                                rdv.status === 'annule' ? '#e74c3c' : '#f39c12',
                            borderColor:
                                rdv.status === 'confirme' ? '#27ae60' :
                                rdv.status === 'annule' ? '#e74c3c' : '#f39c12',
                        }))
                        setEvents(rdvs)
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }, [])
    
    return (
        <div style={styles.container}>
            <div style={styles.legend}>
                <span style={{ ...styles.dot, backgroundColor: '#f39c12' }} /> En attente
                <span style={{ ...styles.dot, backgroundColor: '#27ae60' }} /> Confirmé
                <span style={{ ...styles.dot, backgroundColor: '#e74c3c' }} /> Annulé
            </div>

            <div style={styles.calendar}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale="fr"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    height="auto"
                />
            </div>
        </div>
    )
}

const styles = {
    container: { backgroundColor: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e8edf3' },
    legend: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', fontSize: '13px', color: '#64748b' },
    dot: { display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', marginRight: '6px' },
    calendar: { width: '100%' },
}

export default Calendrier