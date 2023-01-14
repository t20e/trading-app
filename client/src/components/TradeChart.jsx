import React, { useRef, useState, useContext, useEffect } from 'react'
import '../styles/chart.css'
import Chart from "react-apexcharts";
import { arrowSelector } from '../miscellaneous/svgIcons'
import { CurrencyContext } from '../context/CurrencyContext';
import { UserContext } from '../context/UserContext'
import axios from 'axios';
import { generateRandomFloat } from '../utils/callAbleFuncs'

const TradeChart = (props) => {
	// TODO add currrecny PAir to context
	const { currencyPairPrices, setCurrencyPairPrices } = useContext(CurrencyContext)
	const { loggedUser, setLoggedUser } = useContext(UserContext)

	const [chartData, setChartData] = useState({
		series: [
			{
				name: loggedUser.curr_currency,
				data: [...currencyPairPrices.rates]//takes data like this => data: [//  this is a datetime.getTime() num => [1352610000000, 1.4],//   [1352696400000, 1.3],// ]
			}
		],
		options: {
			chart: {
				type: 'area',
				stacked: false,
				height: '100%',
				width: '100%',
				toolbar: {
					autoSelected: 'zoom',
					show: true,
					offsetX: -20,
					offsetY: 0,
					tools: {
						download: false,
						selection: true,
						zoom: true,
						zoomin: true,
						zoomout: true,
						pan: true,
						reset: true | '<img src="/static/icons/reset.png" width="20">',
						customIcons: []
					},
				},
			},
			dataLabels: {
				enabled: false
			},
			zoom: {
				type: 'xy',
				autoScaleYaxis: true,
				autoScaleXaxis: true,
				enabled: true,
			},
			markers: {
				size: 0,
			},
			title: {
				text: `${loggedUser.curr_currency} Price Movement`,
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
				},
				decimalsInFloat: 3,
				labels: {
					show: true,
					align: 'right',
					minWidth: 0,
					// maxWidth: 160,
					style: {
						colors: ["white"],
						fontSize: '.7em',
						// fontFamily: 'Quicksand;',
						fontWeight: 400,
						cssClass: 'apexcharts-yaxis-label',
					},
					// offsetX: 0,
					// offsetY: 0,
					// rotate: 0,
				},
			},
			xaxis: {
				type: 'datetime',
				labels: {
					show: true,
					align: 'right',
					style: {
						colors: ["white"],
						fontSize: '.7em',
						fontWeight: 400,
						cssClass: 'apexcharts-yaxis-label',
					},
				},
			},
		}
	})
	useEffect(() => {
		console.log('here changing charts data')
		setChartData({
			...chartData, series: [
				{
					name: loggedUser.curr_currency,
					data: [...currencyPairPrices.rates]
				}
			]
		})
	}, [currencyPairPrices]);
	useEffect(() => {
		let interval = setInterval(() => {
			const today = new Date();
			const date = today.getFullYear() + '-' + ('0' + today.getMonth() + 1).slice(-2) + '-' + today.getDate();
			let time = ('0' + today.getHours()).slice(-2) + ':' + ('0' + today.getMinutes()).slice(-2) + ':' + ('0' + today.getSeconds()).slice(-2);
			console.log(date + ' ' + time)
			let copy = {...currencyPairPrices}
			copy.rates.push([date + ' ' + time, currencyPairPrices.rates[currencyPairPrices.rates.length - 1][1] + generateRandomFloat(-.05, .05)])
			setCurrencyPairPrices(copy)
			// setCurrencyPairPrices({
			// 	...currencyPairPrices, rates: [...currencyPairPrices.rates,
			// 	[date + ' ' + time, currencyPairPrices.rates[currencyPairPrices.rates.length - 1][1] + generateRandomFloat(-.05, .05)]]
			// 	// ['2023-01-15 11:45:48', currencyPairPrices.rates[currencyPairPrices.rates.length - 1][1] + generateRandomFloat(-.1, .1)]]
			// })
		}, 3000);
		return () => {
			clearInterval(interval)
		};
	}, []);
	const changeCurrencyPair = (pair) => {
		axios.get(`http://localhost:8000/api/trades/getCurrencyPairPrice?pair=${pair}&id=${loggedUser.id}`)
			.then(res => {
				console.log(res)
				setLoggedUser({ ...loggedUser, currCurrency: pair })
				setCurrencyPairPrices(res.data.body.currencyData)
			})
			.catch(err => {
				console.error(err)
			})
	}
	console.log('!!! rerendering trading chart !!!')



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
						{loggedUser.curr_currency}
						{/* set a time count down until next min api call above this */}
						<p>current price: ${parseFloat(currencyPairPrices.rates[currencyPairPrices.rates.length - 1][1]).toFixed(2)}</p>
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
