import React, { useState } from 'react'

const AboutProjectPopUp = (props) => {
    const [close, setClose] = useState('aboutPopUpCont')
    return (
        <div id={close}>
            <p className='keyNote'>
                <i>One key note:</i> I could not find a suitable free api that provides live prices, so my solution was to randomly increase or decrease the price based on the past 30 days prices.
            </p>
            <p>
                This project is a clone of <b>
                    <a  target="_blank" rel="noopener noreferrer" href="https://pocketoption.com/">Pocket Options</a>
                </b> which is a trading platform that allows users to trade currency forecasts meaning if they think the currency pair price will go up and it does go up whithin a set amount of time they will receive their investment plus a percentage payout else if they're wrong they lose their investment.
            </p>
            <div className='aboutProject'>
                <p> <i> made with:</i> react and django</p>
                <p><i>major library's:</i> django-rest-framework, apexCharts</p>
            </div>
            <button onClick={(e) => setClose('closedPopUp')}>close</button>
        </div>
    )
}


export default AboutProjectPopUp
