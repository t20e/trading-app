import React, { useState, useContext } from 'react'
import { AllTradesContext } from '../../context/AllTradesContext';
import { greenArrowSvg, downArrowSvg } from '../../miscellaneous/svgIcons'

const PastTradesPopUp = ({ closePastTradesCont,useCheckClickOutside }) => {
    const { allTrades, setAllTrades } = useContext(AllTradesContext)

    // close when clicked outside
    let domNode = useCheckClickOutside(() => {
        closePastTradesCont()
    })
    return (
        <div ref={domNode} id='aboutPopUpCont'>
            <table>
                <thead>
                    <tr>
                        <th>Currency Pair</th>
                        <th>price</th>
                        <th>prediction</th>
                        <th >profit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        allTrades.map((i, index) => {
                            if (i.isClosed === true) {
                                return (
                                    <tr key={index}>
                                        <td>{i.currency_pair}</td>
                                        <td>${Number(i.price_at_trade).toFixed(3)}</td>
                                        <td>{i.predictingUp ?
                                            greenArrowSvg : downArrowSvg
                                        }</td>
                                        <td>${i.profit}</td>
                                    </tr>
                                )
                            }
                        })
                    }
                </tbody>
            </table>
            <button onClick={closePastTradesCont}>close</button>
        </div>
    )
}


export default PastTradesPopUp
