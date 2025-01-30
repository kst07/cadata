from django.urls import path
from .views import *

urlpatterns = [
    path("api/login/", login_view, name="login"),
]
