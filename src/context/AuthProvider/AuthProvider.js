import React, { createContext } from 'react';
import useAuthentication from '../../hooks/useAuthentication';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const allContext = useAuthentication();
    return (
       <AuthContext.Provider value={allContext}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;