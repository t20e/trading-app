import React, { useRef, useState, useContext, useEffect } from 'react'
import '../styles/chart.css'
import Chart from "react-apexcharts";
import { arrowSelector } from '../miscellaneous/svgIcons'
import { CurrencyContext } from '../context/CurrencyContext';
import { UserContext } from '../context/UserContext'
import axios from 'axios';
import { generateRandomFloat } from '../utils/callAbleFuncs'

const TradeChart = (props) => {
	const { currencyPairPrices, setCurrencyPairPrices } = useContext(CurrencyContext)
	const { loggedUser, setLoggedUser } = useContext(UserContext)
	const [currPrice, setCurrPrice] = useState(null)
	const [chartData, setChartData] = useState({
		series: [
			{
				name: loggedUser.curr_currency,
				data: [...currencyPairPrices.rates]//takes data like this => data: [//  this is a datetime.getTime() num => [1352610000000, 1.4],//   [1352696400000, 1.3],// ]
			}
		],
		options: {
			chart: {
				type: 'line',
				stacked: false,
				height: '100%',
				width: '100%',
				toolbar: {
					autoSelected: 'zoom',
					show: false,
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
				animations: {
					enabled: true,
					easing: 'linear',
					dynamicAnimation: {
						speed: 500,
						enabled: true,
					}
				},
			},
			tooltip: {
				theme: 'dark',
			},
			colors: ['#087243', '#802392'],
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: "smooth",
				width: 2
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
					gradientToColors: ['#F55555', '#6078ea', '#6094ea'],
					shadeIntensity: 1,
					inverseColors: true, //set this to false to not inverse the gradient color
					opacityFrom: 0.5,
					opacityTo: 0,
					stops: [0, 90, 100]
				},
			},
			yaxis: {
				type: 'datetime',
				title: {
					text: 'Price',
					style: {
						color: 'white'
					},
				},
				decimalsInFloat: 3,
				labels: {
					show: true,
					align: 'right',
					minWidth: 0,
					style: {
						colors: ["white"],
						fontSize: '.7em',
						// fontFamily: 'Quicksand;',
						fontWeight: 400,
						cssClass: 'apexcharts-yaxis-label',
					},
				},
			},
			xaxis: {
				range: 100000, //this made the graph zoom better
				type: 'datetime',
				labels: {
					show: true,
					align: 'right',
					style: {
						colors: "white",
						fontSize: '.7em',
						fontWeight: 400,
						cssClass: 'apexcharts-yaxis-label',
					},
				},
			},
		}
	})

	useEffect(() => {
		setChartData({
			...chartData, series: [
				{
					name: loggedUser.curr_currency,
					data: [...currencyPairPrices.rates]
				},
			],
		})
		setCurrPrice(currencyPairPrices.rates[currencyPairPrices.rates.length - 1][1])
	}, [currencyPairPrices, loggedUser.curr_currency]);

	useEffect(() => {
		let interval = setInterval(() => {
			if (currPrice !== null) {
				const today = new Date();
				const date = today.getFullYear() + '-' + ('0' + today.getMonth() + 1).slice(-2) + '-' + today.getDate();
				let time = ('0' + today.getHours()).slice(-2) + ':' + ('0' + today.getMinutes()).slice(-2) + ':' + ('0' + today.getSeconds()).slice(-2);
				let newCurrentPrice = currPrice + generateRandomFloat(-.05, .05)
				setCurrencyPairPrices({
					...currencyPairPrices, rates: [...currencyPairPrices.rates,
					[date + ' ' + time, newCurrentPrice]]
					// ['2023-01-15 11:45:48', currencyPairPrices.rates[currencyPairPrices.rates.length - 1][1] + generateRandomFloat(-.1, .1)]]
				})
				setCurrPrice(newCurrentPrice)
			}
		}, 3000);
		return () => {
			clearInterval(interval)
		};
	}, [currPrice, currencyPairPrices]);

	const changeCurrencyPair = (pair) => {
		axios.get(`http://localhost:8000/api/trades/getCurrencyPairPrice?pair=${pair}&id=${loggedUser.id}`)
			.then(res => {
				console.log(res)
				setLoggedUser({ ...loggedUser, curr_currency: pair })
				setCurrencyPairPrices(res.data.body.currencyData)
			})
			.catch(err => {
				console.error(err)
			})
	}
	// console.log('!!! rerendering trading chart !!!')


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
						<p>current price: ${parseFloat(currPrice).toFixed(2)}</p>
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
						<li onClick={() => changeCurrencyPair('EUR/CAD')}>EUR/CAD</li>
						<li onClick={() => changeCurrencyPair('GBP/EUR')}>GBP/EUR</li>
						<li onClick={() => changeCurrencyPair('EUR/CHF')}>EUR/CHF</li>
						<li onClick={() => changeCurrencyPair('EUR/AUD')}>EUR/AUD</li>
					</div>
				</ul>
			</div>
		</div>
	)
}


export default TradeChart
