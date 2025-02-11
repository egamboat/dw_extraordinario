import React, { createContext, useState, ReactNode, useContext } from 'react';

interface UserContextType {
    user: string | null;
    setUser: (user: string | null) => void;
}

const defaultUserContext: UserContextType = {
    user: null,
    setUser: () => { },
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>("Esaú");

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};