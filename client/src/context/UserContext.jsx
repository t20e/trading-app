import React, { createContext, useState, useMemo, useEffect } from 'react';
import axios from 'axios';
export const UserContext = createContext()

export const UserProvider = (props) => {
    const [loggedUser, setLoggedUser] = useState(null)
    const userValue = useMemo(() => ({ loggedUser, setLoggedUser }), [loggedUser, setLoggedUser])
    useEffect(() => {
        if (localStorage.getItem("userToken")) {
            axios.get('http://localhost:8000/api/users/getLoggedUser', { withCredentials: true })
                .then(res => {
                    console.log('logged user from token', res)
                    // setLoggedUser(res.data.body)
                    // localStorage.setItem("userToken", res.data.token)
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        console.log('token is invalid or unauthenticated')
                        //TODO redirect to login page
                    }
                })
        }else{
            console.log('user not in local storage')
        }
    }, []);
    return (
        <UserContext.Provider value={userValue}>
            {props.children}
        </UserContext.Provider>
    )
}