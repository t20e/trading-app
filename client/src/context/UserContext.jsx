import React, { createContext, useState } from 'react';
export const UserContext = createContext()

export const UserProvider = (props) => {
    const [userContext, setUserContext] = useState(null)
    return (
        <UserContext.Provider value={{ userContext, setUserContext }}>
            {props.children}
        </UserContext.Provider>
    )
}