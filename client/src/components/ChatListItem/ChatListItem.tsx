import { useLoggedUser, useSocket } from "@/context";
import classNames from "classnames";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Room {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  lastName: string;
}

interface Message {
  id: string;
  message: string;
  user: User;
  room: Room;
}

interface ChatListProps {
  room?: Room;
  isSelected: boolean;
  setRoom: Dispatch<SetStateAction<Room|null>>
  messages: Message[];
}

export const ChatListItem = ({ room, isSelected, setRoom, messages }: ChatListProps) => {
  const { user } = useLoggedUser();
  const { socket } = useSocket();

  const [lastMessage, setLastMessage] = useState("Nenhuma mensagem.");

  const getLastMessage = (messages: Message[]) => {
    if (messages.length === 0) return "Nenhuma mensagem.";

    const lastMessage = messages[messages.length - 1];

    return `${lastMessage.user.name} ${lastMessage.user.lastName}: ${lastMessage.message}`;
  };

  const handleSelectRoom = () => {
    if (!socket || !room || isSelected) return;

    setRoom({ ...room });

    socket?.emit("join-room", { room, user });
  };

  useEffect(() => {
    if (!room) return;

    setLastMessage(getLastMessage(messages || []));
  }, [messages]);

  return (
        <div onClick={handleSelectRoom} className={
          classNames(
            "flex flex-row py-4 px-5 items-center border-b-2 border-b-gray-200 cursor-pointer hover:bg-gray-100",
            isSelected && "border-l-4 border-blue-400"
          )}>
        <div className="w-full">
          <div className="text-lg font-semibold">{room?.name}</div>
          <span className="text-gray-500">{lastMessage}</span>
        </div>
      </div>
  );
};
