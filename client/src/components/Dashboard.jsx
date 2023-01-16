import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/dashboard.css'
import '../styles/nav.css'
import TradingPanel from './TradingPanel'
import img from '../imgs/corgie-02.png'
import { pastTradesSvg, restSvg, logoutSvg } from '../miscellaneous/svgIcons'
import TradeChart from './TradeChart'
import { UserContext } from '../context/UserContext'
import axios from 'axios';
import { CurrencyContext } from '../context/CurrencyContext';
import { AllTradesContext } from '../context/AllTradesContext';
import AboutProjectPopUp from './popUps/AboutProjectPopUp'

const Dashboard = () => {
    const { currencyPairPrices, setCurrencyPairPrices } = useContext(CurrencyContext)
    const { allTrades, setAllTrades } = useContext(AllTradesContext)

    const redirect = useNavigate()
    const { loggedUser, setLoggedUser } = useContext(UserContext)
    useEffect(() => {
        if (loggedUser === null) {
            console.log('rendering dashboard useEffect to get user with local storage')
            axios.get('http://localhost:8000/api/users/getLoggedUser/', { withCredentials: true })
                .then(res => {
                    console.log('logged user from token', res.data)
                    setLoggedUser(res.data.body.user)
                    setCurrencyPairPrices(res.data.body.currencyData)
                    setAllTrades(res.data.body.allTrades)
                })
                .catch(err => {
                    console.log(err)
                    if (err.response.status === 401) {
                        console.log('token is invalid or unauthenticated')
                        redirect('/landing_page')
                    }
                })
        }
    }, []);

    const logout = () => {
        console.log('clicked')
        axios.post('http://localhost:8000/api/users/logout/', { withCredentials: true })
            .then(res => {
                console.log(res.data, 'logged out')
                redirect('/landing_page')
            })
            .catch(err => console.log(err))
    }
    const resetNetWorth = () => {
        axios.get(`http://localhost:8000/api/users/resetNetWorth?id=${loggedUser.id}`)
            .then(res => {
                console.log('reset net worth')
                setLoggedUser({ ...loggedUser, balance: 15000 })
            })
            .catch(err => {
                console.error(err)
            })
    }
    return (
        <div id='dash__cont'>
            <nav>
                <ul>
                    <li>
                        <img id='pfp' src={img} alt="" />
                    </li>
                    <li>
                        {/* TODO past trades page */}
                        <button>
                            {pastTradesSvg}
                            <span>view past trades</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={resetNetWorth}>
                            {restSvg}
                            <span>reset net worth</span>
                        </button>
                    </li>
                    <li >
                        <button onClick={logout}>
                            {logoutSvg}
                            <span>logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
            <div id='dash__colTwo'>
                {loggedUser !== null ? currencyPairPrices !== null ?
                    <TradeChart />
                    : null : null}
            </div>
            <div id='dash__colThree'>
                {
                    loggedUser ? <TradingPanel /> : null
                }
            </div>
            {loggedUser ? <AboutProjectPopUp /> : null}
            {/* TODO make sure this is only shown once when the user first
             creates account set a varible in the model to newUser and set
              it defult to true */}
        </div>
    )
}

Dashboard.propTypes = {}

export default Dashboard
