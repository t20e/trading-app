from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    path('getCurrencyPairPrice/', views.getCurrencyPairPrice),
    path('getCurrPairPrice/', views.getCurrPairPrice),
    path('trade/', views.trade)
]