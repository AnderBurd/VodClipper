import React, { useEffect } from 'react';
import { useParams} from 'react-router-dom'
import HypeChart from '../components/HypeChart';

export default function ViewHighlights(){
    const {vodId} = useParams(); //vodId is in the url
    const [loading, setLoading] = useState(true);

    useEffect( () =>{
       const fetchData = async () => {
        try{
            const res = await fetch(``)
        }catch{

        }
       };
    })

    const onTimeSelect = (time) => {
        console.log(time);
    }

    return(
        
    );
};