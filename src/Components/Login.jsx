import React, { useEffect, useState } from 'react'
import { useApiContext } from './ApiProvider';
import { useNavigate } from 'react-router-dom';
export default function Login({}) {

    const {setAccessToken} = useApiContext()
    const navigate = useNavigate()

     function constructUrl(base, parameters){
        let url = base + '?'
        var queryParams = []

        for (var key in parameters){
            if(parameters.hasOwnProperty(key)){
                queryParams.push(encodeURIComponent(key)+ '=' + encodeURIComponent(parameters[key]));
            }
        }
        return url + queryParams.join('&');
    }

    function start(){

        var oauth2EndPoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        var params = {'client_id' : '572995827614-r9rmd2mj407b4hob1g28boaip6lgvb94.apps.googleusercontent.com',
            "redirect_uri" : 'https://musify-client-mu.vercel.app',
            'response_type' : 'token',
            'scope': 'https://www.googleapis.com/auth/youtube',
            'include_granted_scopes' : 'true',
            'state' : 'pass-through-value'
        }
        console.log(constructUrl(oauth2EndPoint, params));

        window.location.href = constructUrl(oauth2EndPoint, params)
    }

    useEffect(()=> {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const token = params.get('access_token')
        if(token){
            setAccessToken(token)
            navigate('/gang')
        }
    }, [])

  return (
    <>
       <div className='w-screen h-screen flex flex-col justify-center items-center gap-12'> 
            <h1 className='text-9xl py-10 px-10 text-center'>Welcome to <span className='text-green-600'>Musify</span></h1>
            <h1 className='text-blue-700 text-3xl text-center'>You can enjoy listening to your favourite music or video with your favourite gang</h1>
             <button className='bg-green-800 text-white text-3xl px-5 py-4 hover:rounded-2xl hover:text-green-800 hover:bg-white transition-all' onClick={start}>Login with google </button>
       </div>
    </>
  )
}
