import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react'


type User = {
  id: string;
  name: string;
  lastName: string;
};

interface UserContextData {
  user: User | null;
  connectUser: (userInfo: User) => void;
  disconnectUser: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextData>({
  user: null,
  connectUser: () => {},
  disconnectUser: () => {},
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const connectUser = ({ id, name, lastName }: User) => {
    const userObject = { id, name, lastName };
    setUser(userObject);
    localStorage.setItem('@user', JSON.stringify(userObject));
  };

  const disconnectUser = () => {
    setUser(null);
    localStorage.removeItem('@user');
  };

  useEffect(() => {
    const localUser = localStorage.getItem('@user');

    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, connectUser, disconnectUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useLoggedUser = () => useContext(UserContext);