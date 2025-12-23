import react, {useState, useEffect} from 'react';
import { useParams} from 'react-router-dom'
import HypeChart from '../components/HypeChart';
import '../styles/ViewHighlights.css'



export default function ViewHighlights(){
    const {vodId} = useParams(); //vodId is in the url
    const [loading, setLoading] = useState(true);
    const [chartData,setChartData] = useState(null);
    
    //Fetch the data by calling our endpoint to find spikes
    useEffect( () =>{
       const fetchData = async () => {
        try{
            const res = await fetch(`http://localhost:3001/api/analytics/by-vod/${vodId}`);
            const result = await res.json();
            setChartData(result);
        }catch(error){
            console.error("Error fetching spike data: ", error)
        }finally{
            setLoading(false);
        }
       };
       fetchData();
    }, [vodId])

    const onTimeSelect = (time) => {
        console.log(time);
    }
    if (loading) return <div>Loading...</div>;
    if (!chartData) return <div>No data</div>;

    return(
        <div className="Hype-wrapper">
        <HypeChart
            allData={chartData.allData}
            spikes={chartData.spikes}
            onTimeSelect={onTimeSelect}
        />
        </div>   
    );
};