import react, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AnalyzeVod.css'

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
      if(result && res.ok){
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
    <div className="analyze-container">
      <div className="analyze-header">
        <h1>VodClipper</h1>
        <p>Paste a Twitch VOD URL to find the best moments</p>
      </div>
      <div className="input-group">
        <input 
          className="analyze-input"
          type="text" 
          placeholder='https://twitch.tv/videos/...' 
          onChange={(e)=> setVodID(e.target.value)} 
          disabled={loading}
        />
        <button 
          className="analyze-button"
          onClick={handleSend} 
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Find Highlights"}
        </button>
      </div>
    </div> 
  )
}