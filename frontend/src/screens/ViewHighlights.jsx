import react, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import HypeChart from '../components/HypeChart';
import '../styles/ViewHighlights.css'

//Use droplet ip
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';


export default function ViewHighlights(){
    const {vodId} = useParams(); //vodId is in the url
    const [loading, setLoading] = useState(true);
    const [chartData,setChartData] = useState(null);
    const [timeStamp, setTimeStamp] = useState("0h:00m:00s")
    const navigate = useNavigate();
    
    //Fetch the data by calling our endpoint to find spikes
    useEffect( () =>{
       const fetchData = async () => {
        try{
            const res = await fetch(`${API_URL}/api/analytics/by-vod/${vodId}`);
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

    //For going back to homescreen
    const handleBack = () => {
        navigate('/');
    }

    /*Just sets the timestamp of the video player when clicking on a point on the graph*/
    const onTimeSelect = (time) => {
        //Move 15 seconds before so theres context to the moment
        const addBuildUpToTime = Math.max(0, time - 15);
        setTimeStamp(addBuildUpToTime);
    }

    if (loading) return <div>Loading...</div>;
    if (!chartData) return <div>No data</div>;

    return(
        <div className="Hype-wrapper">
            
            <div className="email-contact">
                <a href="mailto:contactvodclipper@gmail.com">contactvodclipper@gmail.com</a>
            </div>

            <button className="back-button" onClick={handleBack}>← Back</button>
            <div className="highlights-header">
                <h1>VOD Highlights</h1>
                <p>Click on the chart to jump to high-activity moments</p>
            </div>
        {/*Twitch embed*/}
        <div className='Vid-container'>
            <iframe src={`https://player.twitch.tv/?video=${vodId}&time=${timeStamp}&parent=159.89.130.159`} muted ="false" frameborder="0" allowfullscreen="true" scrolling="no"  preload="auto"></iframe> 
        </div>

        <HypeChart
            allData={chartData.allData}
            spikes={chartData.spikes}
            onTimeSelect={onTimeSelect}
        />
        </div>   
    );
};