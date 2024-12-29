import { Children, createContext, useContext, useState } from "react";



const ApiContext = createContext()
export function useApiContext(){

    return useContext(ApiContext)
}



export default function ApiProvider({children})
{
    const [accessToken, setAccessToken] = useState(null);
    const [isHost, setIsHost] = useState("false")
    const [alreadyHaveARoomId, setAlreadyHaveARoomId] = useState(false)
    const [userName, setUserName] = useState(false)
    const [messages, setMessages] = useState([]);
    let socket = null
    const value = {
        setAccessToken,
        accessToken,
        isHost,
        setIsHost,
        alreadyHaveARoomId,
        setAlreadyHaveARoomId,
        userName,
        setUserName,
        socket,
        messages,
        setMessages
    };
    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
}