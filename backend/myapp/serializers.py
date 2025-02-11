from rest_framework import serializers
from .models import *



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'image', 'price', 'stock']


    
class OrderItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=6, decimal_places=2)

class CreateOrderSerializer(serializers.Serializer):
    cart = OrderItemSerializer(many=True)
    total_price = serializers.DecimalField(max_digits=6, decimal_places=2)
