/*global YT */
import React, { useEffect, useRef, useState } from 'react'
import { useApiContext } from './ApiProvider';
import YouTube from 'react-youtube'

export default function VideoPlayer({id, roomId , socket}) {
    const { setAccessToken,
      accessToken,
      isHost,
      setIsHost,
      alreadyHaveARoomId,
      setAlreadyHaveARoomId, userName,setUserName, messages, setMessages} = useApiContext()
      const [message, setMessage] = useState('');
      
      const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
      });

    let player = useRef(null)
    // console.log(`room id in player is ${roomId} and username ${userName}`)

    const [lastSeekTime, setLastSeekTime] = useState(0);

    
    useEffect(()=> {

      window.addEventListener('resize', ()=> {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      })
      socket.on('playVideo', ()=> {
        player.current.playVideo()
      })

      socket.on('pauseVideo', ()=> {
        player.current.pauseVideo()
      })

      socket.on('seekTo', (time)=>{
        player.current.seekTo(time, true)
      })

      return ()=> {
        socket.off('playVideo')
        socket.off('pauseVideo')
        socket.off('seekTo')
      }
    }, [])
    const onPlay = () =>{
      if(isHost == "true"){
      socket.emit('playerStarted-host', {user: userName, room : roomId})
      }
    }

    const onPause = () => {
      if(isHost == "true"){
      socket.emit('playerPaused-host', {user: userName, room: roomId})
      }
    } 
    
    const onSeek = (event) => {
      // console.log("on seek works")
      if(isHost == "true"){
        // console.log(Number(event.target.getCurrentTime()))
      socket.emit('seekTime-host', {time:Number(event.target.getCurrentTime()), user: userName, room: roomId})
      }
    }
    
    const onStateChange = (event) => {
      const state = event.data;
      const currentTime = event.target.getCurrentTime();
  
      
      if (state === 1) { // Playing state
          onPlay();
      } else if (state === 2) { // Paused state
          onPause();
      }
  
     
  
      if (currentTime !== lastSeekTime) {
          setLastSeekTime(currentTime);
          onSeek(event);
      }
  };

    

    const sendMessage = () => {
      if (message && roomId && userName)  {
          socket.emit('send-message', { room : roomId, message, user: userName});
          setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
          setMessage('');
      }
  };

    function onPlayerReady(event){
        player.current = event.target;
    }
    let eightyPercent = 0
    if(windowSize.width < 640){
      eightyPercent = 99 * windowSize / 100
       
    }
const options = {
  height : windowSize.width < 640 ? '315' : '390',
  width : windowSize.width < 640 ? '560' : '640',
  playerVars:{
    autoplay: 1,
    controls: isHost == "false" ? 0: 1,
    disablekb: isHost == "false" ? 0 : 1
  }
}
  return (
    <> 
      
      <div className='flex flex-col w-full gap-10 '>
        <div  className='flex flex-col  items-center relative w-full h-[390] sm:w-full sm:h-1/2'>
          {console.log(isHost)}
         
           <div style={{width: '100%', height: '100%' , position: 'absolute', display: isHost == "true" ? "none" : 'block', backgroundColor: isHost == "true" ? 'transparent' : 'rgba(0,0,0,0.2)', cursor: isHost == "true" ? 'default' : 'not-allowed'}}></div>
           <YouTube 
           style={{cursor: 'not-allowed'}}
            videoId={id} 
            opts={options} 
            onReady={onPlayerReady}
            onPlay={onPlay}
            onPause={onPause}
            onStateChange={onStateChange}
            onSeek={onSeek}
            />
            

             </div>
           
          <div> 
           <div className="w-full h-64 mx-auto  overflow-y-scroll p-2 border rounded mb-4 bg-gray-100">
                { messages && messages.map((msg, index) => (
                    <div key={index} className="p-1 text-gray-800">
                        {msg}
                    </div>
                ))}
            </div>

            <div className="w-full max-auto flex">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-l focus:outline-none"
                />
                <button
                    onClick={sendMessage}
                    className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
                >
                    Send
                </button>
            </div>
            </div>
          </div>
         
        
          
    </>
  )
}
