import React, { useState, useEffect, useContext, useRef } from 'react'
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
import PastTradesPopUp from './popUps/PastTradesPopUp'
import { no_user_pfp } from '../miscellaneous/svgIcons'

const Dashboard = () => {
    const { currencyPairPrices, setCurrencyPairPrices } = useContext(CurrencyContext)
    const { allTrades, setAllTrades } = useContext(AllTradesContext)
    const [displayPastTrades, setDisplayPastTrades] = useState(false)
    const redirect = useNavigate()
    const { loggedUser, setLoggedUser } = useContext(UserContext)
    useEffect(() => {
        if (loggedUser === null) {
            console.log('rendering dashboard useEffect to get user with local storage')
            axios.get('http://localhost:8000/api/users/getLoggedUser/', { withCredentials: true })
                .then(res => {
                    console.log('logged user from token', res.data.body)
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
                setLoggedUser(null)
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
    const closePastTradesCont = () => {
        setDisplayPastTrades(false)
    }
    const useCheckClickOutside = (handler) => {
        let domRef = useRef()
        useEffect(() => {
            if (domRef.current !== undefined) {
                let checkHandler = (e) => {
                    if (!domRef.current.contains(e.target)) {
                        handler()
                    }
                }
                document.addEventListener("mousedown", checkHandler)
                return () => {
                    document.removeEventListener("mousedown", checkHandler)
                }
            }
        });
        return domRef
    }
    return (
        <div id='dash__cont'>
            <nav>
                <ul>
                    <li>
                        {
                            loggedUser ?
                                loggedUser.pfp_id === "False" ?
                                    no_user_pfp
                                    :
                                    <img id='pfp' src={`https://s3-bucket-avis-new-portfolio.s3.amazonaws.com/users/${loggedUser.pfp_id}`} alt="" />
                                : no_user_pfp
                        }
                    </li>
                    <li>
                        <button onClick={(e) => setDisplayPastTrades(true)}>
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
            <AboutProjectPopUp />
            {displayPastTrades ?
                <PastTradesPopUp closePastTradesCont={closePastTradesCont} useCheckClickOutside={useCheckClickOutside} />
                : null}
        </div>
    )
}

Dashboard.propTypes = {}

export default Dashboard
