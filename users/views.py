from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, UserManager
from .userSerializers import UserSerializer
import os
from django.core.files.storage import default_storage
import uuid as uuid
import jwt
import datetime
import environ
from rest_framework.exceptions import AuthenticationFailed
from trades.views import getHistoricalCurrencyPrice
from trades.tradeSerializers import TradeSerializer

env = environ.Env()
environ.Env.read_env()
# TODO on login or register or getLogged user return the api currency data with base


@api_view(['POST'])
def register(request):
    if request.method != 'POST':
        return JsonResponse({'method': 'not allowed'})
    # If no pfp in FILES, than pfp variable would be False.
    pfp = request.FILES.get('pfp', False)
    if (pfp):  # add the pfp to s3 bucket
        pfp = upload_img_AWS_s3(pfp)
        if 'errors' in pfp:
            return pfp
    data = {
        'first_name': request.POST.get('first_name'),
        'last_name': request.POST.get('last_name'),
        'email': request.POST.get('email'),
        'password': request.POST.get('password'),
        'pfp_id': pfp,
        'age': request.POST.get('age'),
        'confirmPassword': request.POST.get('confirmPassword')
    }
    isValid, res = UserManager.validate_and_create_user(data)
    if isValid:
        payload = {
            'id': res.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30),
            'iat': datetime.datetime.utcnow()
        }
        userToken = jwt.encode(payload,
                               env('APP_SECRET_KEY'),
                               algorithm='HS256')
        # no errors # only set many to True if theres more than one object being serialized
        # print('\n', userToken)
        allTrades = res.trades
        allTrades = TradeSerializer(allTrades, many=True)
        serializer = UserSerializer(res, many=False)
        currencyData = getHistoricalCurrencyPrice(res.curr_currency)
        res = Response()
        res.set_cookie(key='userToken', value=userToken, httponly=True)
        res.data = {
            'body': {
                "user": serializer.data,
                "allTrades": allTrades.data,
                "currencyData": currencyData,
            },
            'errors': False
        }
        return res
    return Response({'body': res, 'errors': True}, status=400)


#  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTksImV4cCI6MTY3NTkwOTAxMywiaWF0IjoxNjczMzE3MDEzfQ.UVFwTz8jzIuQ3ZSxZXgkO4-7IptKI35SCBL6JfaAulY


@api_view(['POST'])
def login(request):
    if request.method != 'POST':
        return Response({'method': 'not allowed'}, status=403)
    data = {
        'email': request.POST.get('email'),
        'password': request.POST.get('password')
    }
    isValid, res = User.objects.loginUser(data)
    if not isValid:
        return Response({'errors': True, 'loginFail': True, 'msg': res})
    # SEND a new JWT token
    payload = {
        'id': res.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30),
        'iat': datetime.datetime.utcnow()
    }
    userToken = jwt.encode(payload, env('APP_SECRET_KEY'), algorithm='HS256')
    allTrades = res.trades
    allTrades = TradeSerializer(allTrades, many=True)
    serializer = UserSerializer(res)
    currencyData = getHistoricalCurrencyPrice(res.curr_currency)
    res = Response()
    res.set_cookie(key='userToken', value=userToken, httponly=True)
    res.data = {
        'body': {
            "user": serializer.data,
            "allTrades": allTrades.data,
            "currencyData": currencyData,
        },
        'errors': False
    }
    return res


@api_view(['GET'])
def getLoggedUser(request):
    token = request.COOKIES.get('userToken')
    if token == None:
        return Response('Unauthenticated token!', status=401)
    try:
        payload = jwt.decode(token,
                             env('APP_SECRET_KEY'),
                             algorithms=['HS256'])
    except jwt.ExpiredSignatureError or jwt.exceptions.InvalidSignatureError:
        # raise AuthenticationFailed('Unauthenticated token!')
        return Response('Unauthenticated token!', status=401)
    print('payload\n\n\n\n', payload)
    user = User.objects.filter(id=payload['id']).first()
    currencyData = getHistoricalCurrencyPrice(user.curr_currency)
    serializer = UserSerializer(user)
    allTrades = user.trades
    allTrades = TradeSerializer(allTrades, many=True)
    res = Response()
    res.data = {
        'body': {
            "allTrades": allTrades.data,
            "user": serializer.data,
            "currencyData": currencyData,
        },
        'errors': False
    }
    return res


@api_view(['POST'])
def logout(request):
    print('Logout')
    # res = Response()
    # res.delete_cookie('userToken')
    # return res
    res = HttpResponse()
    res.delete_cookie(key='userToken')
    res.data = {
        'msg': 'logged out',
    }
    return res


@api_view(['GET'])
def resetNetWorth(request):
    user_id = request.query_params.get('id')
    user = User.objects.get(id=user_id)
    user.balance = 15000
    print(user.balance)
    print(user_id, 'user id')
    user.save()
    return Response('successfully reset net worth', status=200)


# @api_view(['GET'])
# def example(request):
#     # get all the users
#     users = User.objects.all()
#     # the many equal to true will serialize all of the items in a list
#     serializer = UserSerializer(users, many=True)
#     # if serializer.is_valid():
#     #     serializer.save()
#     #     return JsonResponse(serializer.data, status=201)
#     return JsonResponse(serializer.data, status=201, safe=False)
#     # return JsonResponse(serializer.error, status=400)


def upload_img_AWS_s3(pfp):
    if pfp and allowed_files(pfp.name):
        pfp_id = str(uuid.uuid1()) + '_' + pfp.name
        default_storage.save(f"users/{pfp_id}", pfp)
        return pfp_id
    return Response({'errors': 'file type not allowed'})


allowed_file_extensions = {'png', 'jpg', 'jpeg'}


def allowed_files(file):
    return '.' in file and \
        file.rsplit('.', 1)[1].lower() in allowed_file_extensions
