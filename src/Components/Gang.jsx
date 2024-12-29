import React, { useState, useEffect } from 'react'
import { useApiContext } from './ApiProvider'
import { io } from 'socket.io-client'
import RoomComponent from './RoomComponent'

let socket = null
export default function Gang() {
  const {setAccessToken, accessToken, isHost, setIsHost, alreadyHaveARoomId, setAlreadyHaveARoomId, userName, setUserName, messages, setMessages} = useApiContext()
  const [roomId, setRoomId] = useState(null)
  const [roomComponent, setRoomComponent] = useState(false)
  // console.log(`Room id: ${roomId}`)
  // console.log(`Already joined a room: ${alreadyHaveARoomId}`)
  const [formData, setFormData] = useState({
    userName : '',
    host: ''
  })

  // function joinRoom(){
  //   socket.emit('joinRoom', ({user: userName, room: roomId, host: isHost}))
  // }

  function makeRoom(){
    socket.emit('makeRoom', ({user: userName, room: roomId, host: isHost}))
  }
  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

  useEffect(()=>{
    console.log('useffect workeed')
    socket = io('https://narrow-carpal-file.glitch.me')

    socket.on('connect', ()=> {
      console.log('connected to server')
    })

    socket.on('msg', (msg)=>{
      console.log(msg)
    })
    socket.on('receive-message', ({msg, userName}) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, `${userName}: ${msg}`];
      return newMessages.slice(-10);
      }
      );

  });
   
  

  socket.on('user-joined', (message)=> {
    setMessages((prevMessages) => [...prevMessages, message])
  })
    return ()=> {
        socket.off('connect')
        socket.off('msg')
        socket.off('receive-message')
        socket.disconnect()
      
    }
  }, [])
  return (
    <>
    {roomId == null && alreadyHaveARoomId == false ? (
        <div className='w-screen flex flex-col items-center h-screen justify-center'>
          <div className='flex flex-col w-fit h-fit'>
            <label for="">UserName</label>
            <input name='userName' className='border-2 border-green-400' onChange={(e)=>{
              setFormData({
                ...formData,
                userName : e.target.value
              })
            }}  type="text" />
          </div>
          <div className='w-full flex justify-center'>
            <label htmlFor="" className='w-fit'>Is Host? </label>
            <input type="checkbox" name="type" value='yes' id="" onChange={(e)=>{
              if(e.target.checked == true){
                setFormData({
                  ...formData, 
                  host : true
                })
                setIsHost("true")
              }
              
            }} />
            <lable>Yes</lable>
            <input type="checkbox" name="type" value='no' id="" onChange={(e)=>{
              if(e.target.checked == true){
                setFormData({
                  ...formData,
                  host : false
                })
                setIsHost("false")
              }
            }} />
            <lable>No</lable>
            
          </div>
          <button className='bg-green-800 text-white text-3xl px-5 py-4 hover:rounded-2xl hover:text-green-800 hover:bg-white transition-all' 
            onClick={(e)=> {
              
               
              setUserName(formData.userName)
              setRoomId(makeid(5))
            
            }}
          >Submit</button>
          <button
            onClick={()=>{
              setAlreadyHaveARoomId(true)
            }}
           >Do you Already have a room?</button>
        </div>) : (
          
           <>
            {isHost == true && <h1>Generated Room Id {roomId}</h1>
          }
            <div className='w-full flex flex-col items-center'>
              <p>Paste Your Room Id</p>
              <input className='border-2' type="text" name="" id="" onChange={(e)=>{setRoomId(e.target.value)}}/>
              <button onClick={(e)=>{
                setRoomComponent(true)
                makeRoom()
                

              }}>{ isHost == "true" ? "Make Room" : "Join Room"}</button>
            </div>
              {roomComponent && <RoomComponent roomId={roomId} socket={socket}/>}
              
           
          </>
          
          )}


    </>
  )
}
