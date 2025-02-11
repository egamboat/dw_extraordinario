import React, { createContext, useState, ReactNode, useContext } from 'react';

interface UserContextType {
    user: string | null;
    setUser: (user: string | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
}

const defaultUserContext: UserContextType = {
    user: null,
    setUser: () => { },
    token: null,
    setToken: () => { },
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>("Esaú");
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            token,
            setToken
        }}>

            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};