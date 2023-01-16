import React, { useEffect, createContext, useState, useMemo, useContext } from 'react';
import axios from 'axios';
export const CurrencyContext = createContext()

export const CurrencyProvider = (props) => {
    const [currencyPairPrices, setCurrencyPairPrices] = useState(null)
    const currencyValue = useMemo(() => ({ currencyPairPrices, setCurrencyPairPrices }))


    return (
        <CurrencyContext.Provider value={currencyValue}>
            {props.children}
        </CurrencyContext.Provider>
    )
}