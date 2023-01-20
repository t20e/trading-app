from django.shortcuts import render
import requests
from rest_framework.response import Response
from datetime import datetime
import datetime as DT
from rest_framework.decorators import api_view
from .models import User
from .models import Trade, TradeManager
import time
from threading import Timer
import environ
from .tradeSerializers import TradeSerializer

env = environ.Env()
environ.Env.read_env()


@api_view(['POST'])
def checkTradeProfit(request):
    curr_price = float(request.POST.get('curr_price'))
    user = User.objects.filter(id=int(request.POST.get('user_id'))).first()
    trade = Trade.objects.filter(id=int(request.POST.get('trade_id'))).first()
    profit = 0
    print(trade.price_at_trade)
    if trade.predictingUp:
        if trade.price_at_trade <= curr_price:
            profit = trade.investAmount + (trade.investAmount * .92)
    else:
        if trade.price_at_trade >= curr_price:
            profit = trade.investAmount + (trade.investAmount * .92)
    trade.profit = profit
    trade.isClosed = True
    trade.save()
    user.balance += profit
    user.save()
    # print(profit, 'profit', curr_price, trade.price_at_trade)
    serializer = TradeSerializer(trade)
    return Response({'trade': serializer.data}, status=200)


@api_view(['POST'])
def trade(request):
    data = {
        'investAmount': int(request.POST.get('investAmount')),
        'user_id': request.POST.get('user_id'),
        'price_at_trade': float(request.POST.get('price_at_trade')),
        'predictingUp':
        True if request.POST.get('predictingUp') == 'true' else False,
        'currency_pair': request.POST.get('currency_pair'),
    }
    isValid, res = Trade.objects.create_trade(data)
    print(res)
    if isValid is None:
        return Response({"error": res}, status=401)
    # wait 15 secs then call the function
    # wait = Timer(40.0, checkTradeProfit, {data['user_id'], res})
    # wait.start()
    # print('successfully entered trade')
    serializer = TradeSerializer(res, many=False)
    return Response({"trade": serializer.data}, status=200)


@api_view(['GET'])
def getCurrPairPrice(request):
    #  i could not find a free live currency pair api
    # print('getting curr pair price')
    # pair = request.query_params.get('pair')
    # currencies = pair.split("/")
    # url = f'https://api.exchangerate.host/latest?base={currencies[0]}&symbols={currencies[1]}'
    # response = requests.get(url)
    # data = response.json()
    # res = Response()
    # res.data = {
    #     'body': {
    #         "currencyData": [DT.date.today(), data['rates'][currencies[1]]],
    #     },qqq
    #     'errors': False
    # }
    # return res
    return Response('hi')


@api_view(['GET'])
def getCurrencyPairPrice(request):
    # Create your views here.
    pair = request.query_params.get('pair')
    user_id = request.query_params.get('id')
    data = getHistoricalCurrencyPrice(pair)
    user = User.objects.get(id=user_id)
    user.curr_currency = pair
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
