import React, { useEffect, useState } from 'react'
import { useApiContext } from './ApiProvider'
import VideoPlayer from './VideoPlayer'
export default function RoomComponent({roomId, socket}) {
    const {setAccessToken,
        accessToken,
        isHost,
        setIsHost,
        alreadyHaveARoomId,
        setAlreadyHaveARoomId, userName, setUserName} = useApiContext({})
      const [videoDetails, setVideoDetails] = useState([])
      const [search, setSearch] = useState(null)
      const [id, setId] = useState(null)
      const [hostVideoId, setHostVideoId] = useState(null)
      function setVideoId(id){
        setId(id)
        setVideoDetails(null)

      }

      useEffect(()=>{
        socket.on('videoId-fromHost', (videoid)=>{
          setId(videoid)
        })
      })
    async function fetchDataFromYoutube(query){
      console.log("fetching")
         fetch(`https://www.googleapis.com/youtube/v3/search?q=${query}&part=snippet&maxResults=5`, {
          method: "GET",
          headers: {
            'Content-type' : 'application/json',
            'Authorization' : `Bearer ${accessToken}` 
          }
        })
        .then(response => {return response.json()})
        .then((responseData) => {

          console.log(responseData)
          const data = responseData.items.map(obj => 
            ({"id" : obj.id.videoId, "title" : obj.snippet.title, "thumbnail" : obj.snippet.thumbnails.default.url, "width" : 120, "height" : 90  }))
          
          setVideoDetails(data)
            
        })
        .catch(error => console.log(error))
    }
    console.log(search)
    console.log(videoDetails)
    
  return (
    <>
     <div className='w-screen h-full flex flex-col sm:flex-row items-center justify-center ' style={{justifyContent: isHost == "false" ?'center' : 'center'}}>
      {isHost == "true" && 
       <div className='w-full sm:w-1/2 h-full flex-col items-start'>  
        <div className='flex w-full justify-evenly mb-4'>
          <input className='w-2/4 border-2 border-green-600' placeholder='Search...' onChange={(e)=>{
            setSearch(e.target.value)

          }} ></input>
          <button className='ml-2 p-2 bg-green-500 text-white' onClick={()=>{
            fetchDataFromYoutube(search)
          }}>Search</button>
         </div>
        {videoDetails != null && 
          <div className='w-full flex flex-col gap-2'>
           {videoDetails.map(obj => (
              <div key={obj.id} className='flex gap-10 px-5 flex-wrap sm:gap-1 hover:bg-gray-400 hover:shadow-lg' onClick={()=>
              {
                setVideoId(obj.id)
                socket.emit("setVideoId", {video: obj.id, title: obj.title, room : roomId, user: userName})
              
              }} >
                  <img src={obj.thumbnail} width={obj.width} height={obj.height} alt=""/>
                  <h1>{obj.title}</h1>
              </div>
            ))}
           </div>
        }
       </div>
      }
      <VideoPlayer id={id} roomId={roomId} socket={socket}/>
      </div>
    </>
  )
}
