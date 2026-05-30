import { useEffect } from "react"
import { useState } from "react"
import api from "./api"


function Secretaire () {
const [patient,setPatient] = useState([])
useEffect(() => {
    api.get("")
       .then((res) => setPatient(res.data))
       .catch((err) => console.log(err))
} ,[] )

return (
    
    <>
        patient.map()   
    </>


)
}
export default Secretaire