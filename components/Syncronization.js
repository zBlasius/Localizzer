import react, {useState, useEffect} from "react";
import axios from 'axios'

const BASE_URL = 'http://localhost:8080/'

export default function Syncronization({children}){
    const [ssid, setSsid] = useState(undefined)
    const [gambi, setGambi] = useState([1,2])
    
    useEffect(()=>{
        let espSsid = localStorage.getItem('ssid');

        if(!espSsid || espSsid == 'undefined'){
            synchronize()
        } else {
            setSsid(espSsid)
        }
    },[])

    function synchronize(){
        axios.get(BASE_URL + 'synchronize').then(ret => {
            if(ret?.data?.ssid) {
                localStorage.setItem('ssid', ret.data.ssid)
                let newSsid = localStorage.getItem('ssid')
                setSsid(newSsid) 
            }
          })
    }

    return(
        <div>

            { ssid ?
                children
            :<> Sincronizando aparelho.... </>}

        </div>
    )
}