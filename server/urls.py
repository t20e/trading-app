"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import debug_toolbar

# this varible is mandatory
urlpatterns = [
    # only for admin path('admin/', admin.site.urls),
    # path('<url>', view.function)
    # path('hello', views.say_hello),
    # path('authUser/', include('authUser.urls')),
    path('__debug__/', include(debug_toolbar.urls)),
    path('api/users/', include('users.urls')),
    path('api/trades/', include('trades.urls')),
    # path('trades/', include('apps.trades.urls', namespace="trades"))
]