import React, { useState } from 'react'
import { err_red_exclamationPoint } from '../miscellaneous/svgIcons'

const numsOnly = new RegExp(/^[0-9]*$/)

const TradingController = (props) => {
    const [investAmount, setInvestAmount] = useState(500)
    const [errorMsg, setErrorMsg] = useState(false)

    const trade = () => {
        console.log('here')
    }

    const checkInvestInputText = (amount) => {
        if (!numsOnly.test(amount)) {
            setErrorMsg('only numbers are accepted')
            setTimeout(() => {
                setErrorMsg(false)
            }, 3500)
            return true;
        }
        let check = checkInputAmount(amount)
        if (check) return true;
    }
    const checkInputAmount = (amount) => {
        if (investAmount + Number(amount) < 0) {
            setErrorMsg("trade can't be less than $0")
            setTimeout(() => {
                setErrorMsg(false)
            }, 3500)
            return true;
        }
        if (investAmount + Number(amount) > 15000) {
            setErrorMsg('trades are limited to $15,000')
            setTimeout(() => {
                setErrorMsg(false)
            }, 3500)
            return true;
        }
    }
    const btnAddToInvestAmount = (amount) => {
        let check = checkInputAmount(amount)
        if (check) return;
        setInvestAmount(investAmount + Number(amount))
    }
    const changeAmount = (e) => {
        e.preventDefault()
        // TODO make sure only numbers are entered
        let amountRemovedSign = e.target.value.substring(1)
        const checkInput = checkInvestInputText(amountRemovedSign)
        if (checkInput) return;
        setInvestAmount(Number(amountRemovedSign))
    }
    return (
        <>
            <h1> Balance: $10,100</h1>
            <div className={`tradeAmount__cont ${errorMsg ? 'increaseWidth' : ''}`}>
                <p>Amount</p>
                <input type="text" onChange={changeAmount} value={`$${investAmount}`} />
                {errorMsg ?
                    <div className='tradeBlock__alert'>{errorMsg} {err_red_exclamationPoint}</div>
                    : null}
                <div className='tradeBlock__lineBreak'></div>
                <div className='tradeBlock__btn'>
                    <button onClick={() => btnAddToInvestAmount('-10')}>-</button>
                    <div className='tradeBlock__middle'>$</div>
                    <button onClick={() => btnAddToInvestAmount('10')}>+</button>
                </div>
            </div>
            <div className='trade__btns'>
                <button onClick={trade} className='higherPrediction'>higher</button>
                <button onClick={trade} className='lowerPrediction'>lower</button>
            </div>
        </>
    )
}


export default TradingController