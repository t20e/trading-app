import React, {  createContext, useState, useMemo,  } from 'react';


export const AllTradesContext = createContext()

export const AllTradesProvider = (props) => {
    const [allTrades, setAllTrades] = useState([])
    const allTradesValue = useMemo(() => ({ allTrades, setAllTrades }))


    return (
        <AllTradesContext.Provider value={allTradesValue}>
            {props.children}
        </AllTradesContext.Provider>
    )
}