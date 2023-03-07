import { Switch } from "../../components";
import { useSocket } from "../../context/SocketProvider";

export const Status = () => {
  const {
    connectSocket,
    disconnectSocket,
    isConnected
  } = useSocket();

  const handleToggle = () => {
    if (isConnected) {
      return disconnectSocket();
    }

    return connectSocket();
  };

  return (
    <div className="flex text-gray-700 bg-gray-200 justify-center h-screen w-screen p-10">
      <div className="flex rounded-md shadow-md h-fit w-1/2 bg-white flex-col items-center justify-center p-5">
        <h1 className="text-3xl font-bold">WebSockets Status</h1>

        <div className="flex w-full justify-between p-10">
          <h3>Sockets Connection</h3>

          <div className="flex gap-5">
            <h3 className={isConnected ? 'text-lime-600' : 'text-red-600'}>Connected</h3>
            <Switch checked={isConnected} handleOnChange={handleToggle} />
          </div>
        </div>
      </div>
    </div>
  );
};