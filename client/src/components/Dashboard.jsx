import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/dashboard.css'
import '../styles/nav.css'
import TradingPanel from './TradingPanel'
import img from '../imgs/corgie-02.png'
import { pastTradesSvg, restSvg, logoutSvg } from '../miscellaneous/svgIcons'
import TradeChart from './TradeChart'
import { UserContext } from '../context/UserContext'

const Dashboard = () => {
    const redirect = useNavigate()
    const { loggedUser, setLoggedUser } = useContext(UserContext)
    useEffect(() => {
        if (loggedUser == null) {
            redirect('/landing_page')
        }
    }, []);

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
                        {/* TODO reset net worth */}
                        <button>
                            {restSvg}
                            <span>reset net worth</span>
                        </button>
                    </li>
                    <li >
                        {/* TODO logout */}
                        <button>
                            {logoutSvg}
                            <span>logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
            <div id='dash__colTwo'>
                {/* TODO chart */}
                <TradeChart />
            </div>
            <div id='dash__colThree'>
                <TradingPanel />
            </div>
        </div>
    )
}

Dashboard.propTypes = {}

export default Dashboard
