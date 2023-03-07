import { useLoggedUser, useSocket } from "@/context";
import classNames from "classnames";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ChatListItem } from "../ChatListItem";
import { v4 as uuidv4 } from "uuid";

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
  selectedRoom: Room|null;
  setSelectedRoom: Dispatch<SetStateAction<Room|null>>
  rooms: Room[];
  messages: Message[];
}

export const ChatList = ({ selectedRoom, setSelectedRoom, rooms, messages }: ChatListProps) => {
  const { user } = useLoggedUser();
  const { socket } = useSocket();

  const [newChatName, setNewChatName] = useState("");

  const handleCreateRoom = () => {
    if (!socket) return;

    const newRoom = { id: uuidv4(), name: newChatName };

    socket.emit("join-room", { room: newRoom, user});
    setSelectedRoom(newRoom)
    setNewChatName("");
  };

  return (
    <div className="flex flex-col justify-between h-full pb-5">
      <div>
        {rooms?.map((room) => (
          <ChatListItem
            room={room}
            isSelected={selectedRoom?.id === room.id}
            setRoom={setSelectedRoom}
            messages={messages.filter((message) => message.room.id === room.id)}
            />
        ))}
      </div>
      <div className="w-full px-5">
        <input
          value={newChatName}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
          id="username"
          type="text"
          onChange={(e) => setNewChatName(e.target.value)} />
        <button
          type="button"
          disabled={!newChatName.length}
          onClick={handleCreateRoom}
          className="disabled:opacity-25 w-full py-4 px-5 items-center rounded-md cursor-pointer bg-blue-400 hover:bg-blue-500 text-white text-center">
            Adicionar chat
        </button>
      </div>
    </div>
  );
};
