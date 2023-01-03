import React, { useState } from 'react'
import TradingController from './TradingController'
import {greenArrowSvg, downArrowSvg} from '../miscellaneous/svgIcons'



const TradingPanel = () => {
    const [togglePastTrades, setTogglePastTrades] = useState(true)
    return (
        <>
            <div className='tradingUiCont'>
                <TradingController />
            </div>
            <div className='pastTradesCont'>
                <div className='pastTrades__rowOne'>
                    <div onClick={() => setTogglePastTrades(!togglePastTrades)} className={`border--right ${togglePastTrades ? 'currPastTradesTab--selected' : ''}`}>
                        <p>Open Trades</p>
                    </div>
                    <div onClick={() => setTogglePastTrades(!togglePastTrades)} className={!togglePastTrades ? 'currPastTradesTab--selected' : ''}>
                        <p>Closed Trades</p>
                    </div>
                </div>
                <div className='lineBreak'></div>
                {
                    togglePastTrades ?
                        <div className='pastTrades__rowTwo'>
                            {/* past trades ex  */}
                            <div className='pastTrades__headers repeatedPast_trade_cont'>
                                <h5>currency</h5>
                                <h5>price</h5>
                                <h5>prediction</h5>
                                <h5 >time</h5>
                            </div>
                            <div className='repeatedPast_trade_cont'>
                                <h5>EURO/USD</h5>
                                <h5>$1.04</h5>
                                {greenArrowSvg}
                                <h5 >1:01</h5>
                            </div>
                            <div className='repeatedPast_trade_cont'>
                                <h5>EURO/USD</h5>
                                <h5>$1.04</h5>
                                {downArrowSvg}
                                <h5 >4:00</h5>
                            </div>
                            <div className='repeatedPast_trade_cont'>
                                <h5>EURO/USD</h5>
                                <h5>$1.04</h5>
                                {greenArrowSvg}
                                <h5 >2:00</h5>
                            </div>
                        </div>
                        :
                        <div className='pastTrades__rowTwo'>
                            {/* past trades ex  */}
                            <div className='pastTrades__headers repeatedPast_trade_cont'>
                                <h5>currency</h5>
                                <h5>price</h5>
                                <h5>prediction</h5>
                                <h5 >profit</h5>
                            </div>
                            <div className='repeatedPast_trade_cont'>
                                <h5>EURO/USD</h5>
                                <h5>price</h5>
                                {greenArrowSvg}
                                <h5 className='color--goodTrade'>$900</h5>
                            </div>
                            <div className='repeatedPast_trade_cont'>
                                <h5>EURO/USD</h5>
                                <h5>price</h5>
                                {downArrowSvg}
                                <h5 className='color--badTrade'>$0</h5>
                            </div>
                            <div className='repeatedPast_trade_cont'>
                                <h5>EURO/USD</h5>
                                <h5>price</h5>
                                {greenArrowSvg}
                                <h5 className='color--goodTrade'>$900</h5>
                            </div>
                        </div>
                }
            </div>
        </>
    )
}

TradingPanel.propTypes = {}

export default TradingPanel
