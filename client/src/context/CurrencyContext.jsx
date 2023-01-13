import React, { useEffect, createContext, useState, useMemo, useContext } from 'react';
import axios from 'axios';
export const CurrencyContext = createContext()

export const CurrencyProvider = (props) => {
    const [currencyPair, setCurrencyPair] = useState(null)
    const currencyValue = useMemo(() => ({ currencyPair, setCurrencyPair }))


    return (
        <CurrencyContext.Provider value={currencyValue}>
            {props.children}
        </CurrencyContext.Provider>
    )
}