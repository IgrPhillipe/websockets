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
  connectSocket: () => void;
  disconnectSocket:() => void;
  isConnected: boolean;
}

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketContext = createContext<SocketContextData>({
  socket: null,
  connectSocket: () => {},
  disconnectSocket: () => {},
  isConnected: false,
});

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connectSocket = () => {
    socket?.connect();
    setIsConnected(true);
  };

  const disconnectSocket = () => {
    socket?.disconnect();
    setIsConnected(false);
  };

  useEffect(() => {
    const newSocket = io('http://localhost:3001');

    if (newSocket) {
      setSocket(newSocket);
      setIsConnected(true);

      newSocket.on('connected', (response) => {
        console.log(response);
      });
    }

    return () => {
      newSocket.disconnect();
      setIsConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);