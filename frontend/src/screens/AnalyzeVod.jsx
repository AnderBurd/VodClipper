import react, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AnalyzeVod.css'

//Use droplet ip
const API_URL = import.meta.env.VITE_API_URL || 'http://159.89.130.159';

export default function AnalyzeVod(){
    const [vodInput,setVodID] = useState('');
    //Use this to keep track of when the analyzer is loading
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    //recent vods
    const [recentVods, setRecentVods] = useState([]);

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
      const res = await fetch(`${API_URL}/processVod/${vodId}`, {
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

  //Fetches the history using out endpoint
  useEffect(() =>{
    const fetchHistory = async () =>{
      try{
        const res = await fetch(`${API_URL}/api/recent-vods`);
        const result = await res.json();
        setRecentVods(result.vods);
      }
      catch(error){
        console.error("Error fetching history: ", error)
      }
    }
    fetchHistory();
    
    // Refetch every time component is focused
    window.addEventListener('focus', fetchHistory);
    return () => window.removeEventListener('focus', fetchHistory);
  }, []);

  
  return(
    <div className="analyze-container">
      <div className="email-contact">
        <a href="mailto:contactvodclipper@gmail.com">contactvodclipper@gmail.com</a>
      </div>
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
      
      <div className="input-note">
        <p>Go to a VOD on Twitch and copy and paste the link. Note that long VODs may take a little while to process.</p>
      </div>

      <div className="recent-section">
          <h3>Check out what others are watching!</h3>
          <div className="recents">
            {recentVods && recentVods.length > 0 ? (
              recentVods.map((vod) =>(
                <div 
                    key={vod.vod_id} 
                    className="vod-card" 
                    onClick={() => navigate(`/v/${vod.vod_id}`)}
                >
                    <iframe src={`https://player.twitch.tv/?video=${vod.vod_id}&time=00h20m05s&parent=159.89.130.159&muted=true`} autoplay="true" frameborder="0" allowfullscreen="false" scrolling="no"></iframe> 

                </div>
              ))
            ) : (
              <p>No recent VODs available</p>
            )}
          </div>
      </div>

    </div> 
  )
}