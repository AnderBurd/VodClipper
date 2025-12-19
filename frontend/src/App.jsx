import { useState } from 'react'
import './styles/App.css'

function App() {
  const [vodInput,setVodID] = useState('');

  const handleSend = async () => {

    const vodId = vodInput.includes('videos/') 
      ? vodInput.split('videos/')[1].split('?')[0] 
      : vodInput;

    if(!vodId){
      return alert("Please enter a Vod ID")
    }
    try{
      const res = await fetch(`http://localhost:3001/processVod/${vodId}`, {
        method: 'GET',
      });
      const result = await res.json();
      if(result.message){
        console.log("Success");
      }
      else{
        alert("Failed to analyze the vod")
      }

    }catch(error){
      console.error("Error connecting to backend: ", error);
    }
  };

  return(
    <div>
      <input type="text" placeholder='Twitch Vod URL' onChange={(e)=> setVodID(e.target.value)}>
      </input>
      <button onClick={handleSend}>Send</button>
    </div>
  )
}

export default App
