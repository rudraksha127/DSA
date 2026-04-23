import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useSocket = () => {
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { withCredentials: true })
    return () => { socketRef.current?.disconnect() }
  }, [])

  return socketRef.current
}
