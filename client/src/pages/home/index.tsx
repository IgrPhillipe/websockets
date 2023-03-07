import { useSocket } from "../../context/SocketProvider";

export const Home = () => {
  const socket = useSocket();

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};