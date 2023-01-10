from django.contrib import admin
from django.urls import path
from . import views
# from rest_framework_simplejwt.views import (
#     TokenRefreshView,
# )
# from .tokenSerializer import MyTokenObtainPairView

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('getLoggedUser/', views.getLoggedUser),
    # path('example/', views.example),
    # path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
