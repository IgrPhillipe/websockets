import { useLoggedUser } from "@/context";
import classnames from "classnames";

interface User {
  id: string;
  name: string;
  lastName: string;
}

interface MessageProps {
  message: string;
  user: User;
}

export const Message: React.FC<MessageProps> = ({ message, user }) => {
  const { user: currentUser } = useLoggedUser();
  const isFromCurrentUser = user?.id === currentUser?.id;

  const getInitials = () => `${user.name[0]}${user.lastName[0]}`;
  
  return (
    <div className={
      classnames(
        "flex mb-4 justify-end",
        !isFromCurrentUser && "flex-row-reverse"
    )}>
      <div className={
        classnames(
          "mr-2 py-3 px-4 text-white",
          isFromCurrentUser
            ? "bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl"
            : "bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl"
        )}>
        {message}
      </div>
      <div className={
        classnames(
          "mr-2 py-3 px-4 flex justify-center items-center text-center opacity-50 rounded-full",
          isFromCurrentUser ? "bg-blue-400" : "bg-gray-400"
        )}>
          {getInitials()}
      </div>
    </div>
  );
};
