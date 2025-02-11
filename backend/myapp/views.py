from django.contrib.auth import authenticate, logout
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import ValidationError
from .serializers import *
from .models import *

from django.core.exceptions import ValidationError

@api_view(['POST'])
def login_view(request):
    username = request.data.get("username")  
    password = request.data.get("password")  
    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "username": user.username,
        "is_superuser": user.is_superuser
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def logout_view(request):
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticatedOrReadOnly]  # อ่านได้ทุกคน แต่สร้างต้องล็อกอิน

    def perform_create(self, serializer):
        serializer.save()

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAdminUser]  # ต้องเป็นแอดมินเท่านั้นถึงแก้ไข ลบได้


 
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def create_order(request):
    # ใช้ CreateOrderSerializer เพื่อรับข้อมูลจากคำขอ
    serializer = CreateOrderSerializer(data=request.data)
    
    if serializer.is_valid():
        cart = serializer.validated_data.get('cart', [])
        total_price = serializer.validated_data.get('total_price', 0)
        
        if not cart:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        if total_price <= 0:
            return Response({"error": "Invalid total price"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                order = Order.objects.create(total_price=total_price)

                for item in cart:
                    product_id = item.get('product_id')
                    quantity = item.get('quantity')

                    if not product_id or quantity <= 0:
                        return Response({"error": "Invalid product or quantity"}, status=status.HTTP_400_BAD_REQUEST)

                    product = get_object_or_404(Product, id=product_id)

                    if product.stock < quantity:
                        raise ValidationError(f"Not enough stock for {product.name}")

                    price_per_item = product.price
                    total_price_for_item = price_per_item * quantity

                    # สร้าง OrderItem ใหม่
                    OrderItem.objects.create(order=order, product=product, quantity=quantity, price=price_per_item)

                    # ลดจำนวนสินค้าในสต็อก
                    product.stock -= quantity
                    product.save()

                    # อัพเดตยอดรวม
                    total_price -= total_price_for_item

                # อัพเดตคำสั่งซื้อ
                order.total_price = total_price
                order.save()

                return Response({"message": "Order created successfully", "order_id": order.id}, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": "An error occurred while creating order"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

