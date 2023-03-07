import { useLoggedUser, useSocket } from "@/context";
import { CreateUser, Message, ChatList } from "@/components";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {  } from "@/components/ChatList";

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
  room: Room;
  user: User;
}

export const Chat = () => {
  const { user } = useLoggedUser();
  const { socket } = useSocket();

  const [selectedRoom, setSelectedRoom] = useState<Room|null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesContainer = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputText || !user || !socket || !selectedRoom) return;

    const message = {
      id: uuidv4(),
      message: inputText,
      room: selectedRoom,
      user: user,
    };

    setMessages((prev) => [...prev, message]);
    socket.emit("new-message", message);

    setInputText("");
  };

  useEffect(() => {
    if (messagesContainer?.current) {
      messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (!socket) return;

    socket.on("all-rooms", (response) => {
      const responseRooms: Room[] = [];
      const responseMessages: Message[] = [];

      response.forEach((item: {id: string, name: string, messages: Message[]}) => {
        const { messages, ...itemRoom } = item;
        responseRooms.push(itemRoom);
        responseMessages.push(...messages);
      });

      setRooms([...responseRooms]);
      setMessages([...responseMessages]);
    });

  }, [socket]);

  if (!user) {
    return <CreateUser />;
  }

  return (
    <div className="flex h-screen bg-gray-200 justify-center h-screen w-screen p-10 gap-5">
      <div className="w-1/3 h-full flex flex-col bg-white rounded-md shadow-md">
        <ChatList
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          rooms={rooms}
          messages={messages}
        />
      </div>
      <div className="w-2/3 h-full flex flex-col gap-5">
       <div ref={messagesContainer} className="h-full overflow-auto">
        <div className="w-full min-h-full px-5 flex flex-col justify-end bg-white rounded-md shadow-md">
            {selectedRoom && messages.filter((item) => item.room.id === selectedRoom.id).map(({ message, id, user }) => (
              <Message key={id} message={message} user={user} />
            ))}
          </div>
       </div>

        <div className="flex gap-5">
          <input
            onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
            className="w-full bg-gray-300 py-5 px-3 rounded-md outline-none"
            type="text"
            placeholder="Escreva sua mensagem"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            disabled={!inputText.length}
            onClick={handleSendMessage}
            className="disabled:opacity-25 flex items-center justify-center bg-blue-400 hover:bg-blue-600 rounded-md text-white px-4 py-1">
            <span>Enviar</span>
            <span className="ml-2">
              <svg
                className="w-4 h-4 transform rotate-45 -mt-px"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
