import React, { useState, useEffect, useRef, useContext } from 'react'

import { err_red_exclamationPoint } from '../miscellaneous/svgIcons'
import { UserContext } from '../context/UserContext'
import axios from 'axios'
import { CurrencyContext } from '../context/CurrencyContext';
import { AllTradesContext } from '../context/AllTradesContext';


const numsOnly = new RegExp(/^[0-9]*$/)


const TradingController = (props) => {
    const { allTrades, setAllTrades } = useContext(AllTradesContext)
    const { loggedUser, setLoggedUser } = useContext(UserContext)
    const [investAmount, setInvestAmount] = useState(500)
    const [errorMsg, setErrorMsg] = useState(false)
    const { currencyPairPrices, setCurrencyPairPrices } = useContext(CurrencyContext)
    const currPriceRef = useRef(null)
    // # to clear interval
    const intervalRef = useRef(null)
    // # to clear timeout
    const time_out = useRef(null)
    // # to store the trades data
    const tradeRef = useRef(null)

    useEffect(() => {
        // Clear the timeout when the component unmounts
        return () => {
            clearInterval(intervalRef.current)
            clearTimeout(time_out.current)
        }
    }, []);
    useEffect(() => {
        tradeRef.current = allTrades
    }, [allTrades])
    useEffect(() => {
        currPriceRef.current = currencyPairPrices.rates[currencyPairPrices.rates.length - 1][1]
    }, [currencyPairPrices])

    const trade = (e, predictingUp) => {
        e.preventDefault()
        if (checkInputAmount(investAmount)) {
            return
        }
        // console.log('currentPrice', currPriceRef.current)
        const data = new FormData()
        data.append("investAmount", investAmount);
        data.append("user_id", loggedUser.id);
        data.append("price_at_trade", currPriceRef.current);
        data.append("predictingUp", predictingUp);
        data.append("currency_pair", loggedUser.curr_currency);
        axios.post('http://localhost:8000/api/trades/trade/', data)
            .then(res => {
                let trade = res.data.trade
                trade.counter = 2
                setAllTrades([trade, ...allTrades])
                setLoggedUser({ ...loggedUser, balance: loggedUser.balance - investAmount })
                if (investAmount > loggedUser.balance) {
                    setInvestAmount(loggedUser.balance / 2)
                }
                time_out.current = setTimeout(() => {
                    checkTradeProfit(trade)
                }, 2000);
                intervalRef.current = setInterval(() => {
                    tradeRef.current.map(obj => {
                        if (obj.id === trade.id) {
                            if (obj.counter === 0) {
                                return clearInterval(intervalRef)
                            }
                            obj.counter -= .5
                        }
                    })
                }, 500)
            })
            .catch(err => {
                console.error(err)
            })
    }

    const checkTradeProfit = (tradeObj) => {
        // if profit update the user with profit amount else update trade object in the panel with new data
        // console.log('new price', currPriceRef.current)
        const data = new FormData()
        data.append("trade_id", tradeObj.id);
        data.append("user_id", loggedUser.id);
        data.append("curr_price", currPriceRef.current);
        axios.post('http://localhost:8000/api/trades/checkProfit/', data)
            .then(res => {
                let trade = res.data.trade
                setLoggedUser({ ...loggedUser, balance: loggedUser.balance += trade.profit })
                tradeRef.current.map(obj => {
                    if (obj.id === trade.id) {
                        obj.isClosed = true
                        obj.profit = trade.profit
                    }
                })
                setAllTrades(tradeRef.current)
            })
            .catch(err => {
                console.error(err)
            })
    }

    const checkInvestInputText = (amount) => {
        if (!numsOnly.test(amount)) {
            setErrorMsg('only numbers are accepted')
            setTimeout(() => {
                setErrorMsg(false)
            }, 3500)
            return true;
        }
        let check = checkInputAmount(Number(amount))
        if (check) return true;
    }

    const checkInputAmount = (amount) => {
        let checkIfErr = false
        if (investAmount + amount < 0) {
            setErrorMsg("trade can't be less than $0")
            checkIfErr = true
        }
        if (loggedUser.balance - amount < 0) {
            setErrorMsg("you don't have enough to make that trade")
            checkIfErr = true
        }
        if (amount === 10) {
            if (investAmount + amount > 15000) {
                setErrorMsg('trades are limited to $15,000')
                checkIfErr = true
            }
        }
        if (checkIfErr) {
            setTimeout(() => {
                setErrorMsg(false)
            }, 3500)
            return true
        }
    }
    const btnAddToInvestAmount = (amount) => {
        let check = checkInputAmount(amount)
        if (check) return;
        setInvestAmount(investAmount + Number(amount))
    }
    const changeAmount = (e) => {
        e.preventDefault()
        let amountRemovedSign = e.target.value.substring(1)
        const checkInput = checkInvestInputText(amountRemovedSign)
        if (checkInput) return;
        console.log('here')
        setInvestAmount(Number(amountRemovedSign))
    }
    return (
        <>
            <h1> Balance: {parseFloat(loggedUser.balance).toFixed(2)}</h1>
            <div className={`tradeAmount__cont ${errorMsg ? 'increaseWidth' : ''}`}>
                <p>Amount</p>
                <input type="text" onChange={changeAmount} value={`$${investAmount}`} />
                {errorMsg ?
                    <div className='tradeBlock__alert'>{errorMsg} {err_red_exclamationPoint}</div>
                    : null}
                <div className='tradeBlock__lineBreak'></div>
                <div className='tradeBlock__btn'>
                    <button onClick={() => btnAddToInvestAmount(-10)}>-</button>
                    <div className='tradeBlock__middle'>$</div>
                    <button onClick={() => btnAddToInvestAmount(10)}>+</button>
                </div>
            </div>
            <div className='trade__btns'>
                <button onClick={(e) => trade(e, true)} className='higherPrediction'>higher</button>
                <button onClick={(e) => trade(e, false)} className='lowerPrediction'>lower</button>
            </div>
        </>
    )
}


export default TradingController