from django.urls import path
from .views import *

urlpatterns = [
    path("api/login/", login_view, name="login"),
    path("api/logout/", logout_view, name="logout"),
    path('api/products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('api/products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path("api/create-order/", create_order, name="create-order"),  
    
]