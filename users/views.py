from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, UserManager
from .userSerializers import UserSerializer

allowed_file_extentions = {'png', 'jpg', 'jpeg'}


def allowed_files(file):
    return '.' in file and \
        file.rsplit('.', 1)[1].lower() in allowed_file_extentions


@api_view(['POST'])
def register(request):
    # if request.method != 'POST':
    #     return JsonResponse({'method': 'not allowed'})
    # data = {
    #     'first_name': request.POST.get('first_name'),
    #     'last_name': request.POST.get('last_name'),
    #     'email': request.POST.get('email'),
    #     'password': request.POST.get('password'),
    #     'pfp_id': request.POST.get('pfp_id'),
    #     'age': request.POST.get('age'),
    #     'confirmPassword': request.POST.get('confirmPassword')
    # }

    # valid, res = UserManager.validate_and_create_user(data)
    # if valid:
    #     # no errors
    #                                         # only set many to True if theres more than one object being serialized
    #     serializer = UserSerializer(res, many=False)
    #     return Response({'body': serializer.data, 'errors': False}, status=201)
    # # # how to flash using django messages
    # # for error in res:
    # #     messages.error(req, error)
    # return Response({'body': res, 'errors': True}, status=201)
    pfp = request.FILES['pfp']
    print(pfp.name)
    pfp_id = None
    # if pfp and allowed_files(pfp.name):

    return Response({'body': 'hi'})


@api_view(['POST'])
def test(request):
    # return HttpResponse('hi')
    print(request.POST)
    return Response('hi')


@api_view(['GET'])
def example(request):
    # get all the users
    users = User.objects.all()
    # the many equal to true will serialize all of the items in a list
    serializer = UserSerializer(users, many=True)
    # if serializer.is_valid():
    #     serializer.save()
    #     return JsonResponse(serializer.data, status=201)
    return JsonResponse(serializer.data, status=201, safe=False)
    # return JsonResponse(serializer.error, status=400)
