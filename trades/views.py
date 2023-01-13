from django.shortcuts import render
import requests
from rest_framework.response import Response
from datetime import datetime
import datetime as DT
from rest_framework.decorators import api_view
from .models import User


@api_view(['GET'])
def getCurrPairPrice(request):
    print('getting curr pair price')
    pair = request.query_params.get('pair')
    currencies = pair.split("/")
    url = f'https://api.exchangerate.host/latest?base={currencies[0]}&symbols={currencies[1]}'
    response = requests.get(url)
    data = response.json()
    res = Response()
    res.data = {
        'body': {
            "currencyData": [DT.date.today(), data['rates'][currencies[1]]],
        },
        'errors': False
    }
    return res


@api_view(['GET'])
def getCurrencyPairPrice(request):
    # Create your views here.
    pair = request.query_params.get('pair')
    user_id = request.query_params.get('id')
    data = getHistoricalCurrencyPrice(pair)
    user = User.objects.get(id=user_id)
    user.currCurrency = pair
    user.save()
    res = Response()
    res.data = {
        'body': {
            "currencyData": data,
        },
        'errors': False
    }
    return res


def getHistoricalCurrencyPrice(currencyPair):
    print(currencyPair)
    # today_date = datetime.today().strftime('%Y-%m-%d')
    today_date = DT.date.today()
    to_past_date = today_date - DT.timedelta(days=30)
    # print('\n', today_date,'\n',to_past_date)
    data = {}
    currencies = currencyPair.split("/")
    url = f'https://api.exchangerate.host/timeseries?start_date={to_past_date}&end_date={today_date}&base={currencies[0]}&symbols={currencies[1]}'
    response = requests.get(url)
    data = response.json()
    rates = []
    for date, price in data['rates'].items():
        rates.append([date, price[currencies[1]]])
    data['rates'] = rates
    return data
