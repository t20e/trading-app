import React, { useState, useContext } from 'react'
import TradingController from './TradingController'
import { greenArrowSvg, downArrowSvg } from '../miscellaneous/svgIcons'
import { AllTradesContext } from '../context/AllTradesContext';



const TradingPanel = () => {
    const [toggleOpenTrades, setToggleOpenTrades] = useState(true)
    const { allTrades, setAllTrades } = useContext(AllTradesContext)

    return (
        <>
            <div className='tradingUiCont'>
                <TradingController />
            </div>
            <div className='viewTradesCont'>
                <div className='pastTrades__rowOne'>
                    <div onClick={() => setToggleOpenTrades(!toggleOpenTrades)} className={`border--right ${toggleOpenTrades ? 'currPastTradesTab--selected' : ''}`}>
                        <p>Open Trades</p>
                    </div>
                    <div onClick={() => setToggleOpenTrades(!toggleOpenTrades)} className={!toggleOpenTrades ? 'currPastTradesTab--selected' : ''}>
                        <p>Closed Trades</p>
                    </div>
                </div>
                <div className='lineBreak'></div>
                {
                    toggleOpenTrades ?
                        <div className='pastTrades__rowTwo'>
                            <div className='pastTrades__headers repeatedPast_trade_cont'>
                                <h5>currency</h5>
                                <h5>price</h5>
                                <h5>prediction</h5>
                                <h5 >time</h5>
                            </div>

                            {
                                allTrades.map((i, index) => {
                                    if (i.isClosed === false) {
                                        // console.log(i)
                                        return (
                                            <div key={index} className='repeatedPast_trade_cont'>
                                                <h5>{i.currency_pair}</h5>
                                                <h5>${i.price_at_trade}</h5>
                                                {i.predictingUp ?
                                                    greenArrowSvg : downArrowSvg
                                                }
                                                <h5 className={i.profit > 0 ? 'color--goodTrade' : 'color--badTrade'}>${i.profit}</h5>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                        :
                        <div className='pastTrades__rowTwo'>
                            <div>
                                <div className='pastTrades__headers repeatedPast_trade_cont'>
                                    <h5>currency</h5>
                                    <h5>price</h5>
                                    <h5>prediction</h5>
                                    <h5 >profit</h5>
                                </div>
                                {
                                    allTrades.map((i, index) => {
                                        // console.log(i)
                                        if (i.isClosed === true) {
                                            return (
                                                <div key={index} className='repeatedPast_trade_cont' >
                                                    <h5>{i.currency_pair}</h5>
                                                    <h5>${i.price_at_trade}</h5>
                                                    {i.predictingUp ?
                                                        greenArrowSvg : downArrowSvg
                                                    }
                                                    <h5>TIME</h5>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                }
            </div>
        </>
    )
}

TradingPanel.propTypes = {}

export default TradingPanel
