import { useLoggedUser } from "@/context";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface User {
  name?: string;
  lastName?: string;
};

export const CreateUser: React.FC = () => {
  const  { connectUser } = useLoggedUser();
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const handleSubmit = () => {
    if (userInfo?.name && userInfo?.lastName) {
      connectUser({
        id: uuidv4(),
        name: userInfo.name,
        lastName: userInfo.lastName
      });
    }
  };

  return (
    <div className="flex bg-gray-200 items-center justify-center h-screen w-screen p-10">
      <div className="flex rounded-md shadow-md h-fit w-1/2 bg-white flex-col items-center justify-center p-10">
        <h1 className="text-3xl text-gray-700 font-bold mb-5">Cadastrar Usuário</h1>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="m-5 mb-10">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Nome
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              onChange={(e) => setUserInfo((prev) => ({ ...prev, name: e.target.value }))} />
          </div>

          <div className="m-5 mb-10">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Sobrenome
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              onChange={(e) => setUserInfo((prev) => ({ ...prev, lastName: e.target.value }))} />
          </div>
          
          <div className="flex items-center justify-center">
            <button
              disabled={!userInfo?.name?.length || !userInfo?.lastName?.length}
              className="disabled:opacity-25 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit">
                Acessar
            </button>
          </div>
        </form>
  
      </div>
    </div>
  )
}