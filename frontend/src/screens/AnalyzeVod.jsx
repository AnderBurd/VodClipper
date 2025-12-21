import react, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function AnalyzeVod(){
    const [vodInput,setVodID] = useState('');
    //Use this to keep track of when the analyzer is loading
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSend = async () => {
    //allow users to paste the whole vod link
    const vodId = vodInput.includes('videos/') 
      ? vodInput.split('videos/')[1].split('?')[0] 
      : vodInput;

    if(!vodId){
      return alert("Please enter a Vod ID")
    }
    //Start loading
    setLoading(true);
    try{
      const res = await fetch(`http://localhost:3001/processVod/${vodId}`, {
        method: 'GET',
      });
      const result = await res.json();
      if(result.message){
        console.log("Success");
        navigate(`/v/${vodId}`);
      }
      else{
        alert("Failed to analyze the vod")
      }

    }catch(error){
      console.error("Error connecting to backend: ", error);
    }finally{
      setLoading(false); //Finish loading
    }
  };

  return(
    <div>
      <input type="text" placeholder='Twitch Vod URL' onChange={(e)=> setVodID(e.target.value)} disabled={loading}>
      </input>
      <button onClick={handleSend} disabled={loading}>{loading ? "Analyzing..." : "Find Highlights"}</button>
      </div> 
  )
}