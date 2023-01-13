import React, { useRef, useState, useContext, useEffect } from 'react'
import '../styles/chart.css'
import Chart from "react-apexcharts";
import { arrowSelector } from '../miscellaneous/svgIcons'
import { CurrencyContext } from '../context/CurrencyContext';
import { UserContext } from '../context/UserContext'
import axios from 'axios';


const TradeChart = (props) => {
  const { currencyPair, setCurrencyPair } = useContext(CurrencyContext)
  const { loggedUser, setLoggedUser } = useContext(UserContext)

  const [chartData, setChartData] = useState({
    series: [
      {
        name: loggedUser.currCurrency,
        data: [...currencyPair.rates]//takes data like this => data: [//   [1352610000000, 1.4],//   [1352696400000, 1.3],// ]
      }
    ],
    options: {
      chart: {
        type: 'area',
        stacked: false,
        height: '100%',
        width: '100%',
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      title: {
        text: `${loggedUser.currCurrency} Price Movement`,
        align: 'center'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        type: 'datetime',
        title: {
          text: 'Price'
        }
      },
      xaxis: {
        type: 'datetime',
      },
    }
  })
  useEffect(() => {
    setChartData({
      ...chartData, series: [
        {
          name: loggedUser.currCurrency,
          data: [...currencyPair.rates]
        }
      ]
    })
  }, [currencyPair]);
  const changeCurrencyPair = (pair) => {
    axios.get(`http://localhost:8000/api/trades/getCurrencyPairPrice?pair=${pair}&id=${loggedUser.id}`)
      .then(res => {
        console.log(res)
        setLoggedUser({ ...loggedUser, currCurrency: pair })
        setCurrencyPair(res.data.body.currencyData)
      })
      .catch(err => {
        console.error(err)
      })
  }
  console.log('!!! rerendering trading chart !!!')

  const getCurrPairPrice = (pair) => {
    axios.get(`http://localhost:8000/api/trades/getCurrPairPrice?pair=${pair}`)
      .then(res => {
        console.log(res.data.body.currencyData)
        setCurrencyPair({ ...currencyPair, rates:[...currencyPair.rates, res.data.body.currencyData] })
      })
      .catch(err => {
        console.error(err)
      })
  }
  useEffect(() => {
    let interval;
    let timeout = setTimeout(() => {
      interval = setInterval(() => {
        getCurrPairPrice(loggedUser.currCurrency)
      }, 120000);
    }, 5000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    };
  }, []);

  return (
    <div id='chart'>
      <Chart
        options={chartData.options}
        series={chartData.series} type="area"
        height={"100%"}
      />
      <div className='currencySelector__block'>
        <ul >
          <li className='currCurrency'>
            {loggedUser.currCurrency}
            <p>current price: ${parseFloat(currencyPair.rates[currencyPair.rates.length - 1][1]).toFixed(2)}</p>
            {arrowSelector}
          </li>
          <div>
            <li>change currency</li>
            <li onClick={() => changeCurrencyPair('EUR/USD')}>EUR/USD</li>
            <li onClick={() => changeCurrencyPair('USD/CHF')}>USD/CHF</li>
            <li onClick={() => changeCurrencyPair('GBP/USD')}>GBP/USD</li>
            <li onClick={() => changeCurrencyPair('NZD/USD')}>NZD/USD</li>
            <li onClick={() => changeCurrencyPair('AUD/USD')}>AUD/USD</li>
            <li onClick={() => changeCurrencyPair('USD/CAD')}>USD/CAD</li>
            <li onClick={() => changeCurrencyPair('USD/JPY')}>USD/JPY</li>
            <li onClick={() => changeCurrencyPair('EUR/CAD')}>EUR/CAD</li>
            <li onClick={() => changeCurrencyPair('GBP/EUR')}>GBP/EUR</li>
            <li onClick={() => changeCurrencyPair('EUR/CHF')}>EUR/CHF</li>
            <li onClick={() => changeCurrencyPair('EUR/AUD')}>EUR/AUD</li>
            <li onClick={() => changeCurrencyPair('EUR/JPY')}>EUR/JPY</li>
          </div>
        </ul>
      </div>
    </div>
  )
}


export default TradeChart
