import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react'

import io, { Socket } from 'socket.io-client';

interface SocketContextData {
  socket: Socket | null;
}

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketContext = createContext<SocketContextData>({
  socket: null,
});

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');

    if (newSocket) {
      setSocket(newSocket);

      newSocket.on('connected', (response) => {
        console.log(response);
      });
    }

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const { socket } = useContext(SocketContext);

  return socket;
}