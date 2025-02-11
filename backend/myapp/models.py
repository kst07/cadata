from django.db import models
from django.utils import timezone

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('coffee', 'กาแฟ'),
        ('chocolate', 'ช็อคโกแลต'),
        ('cocoa', 'โกโก้'),
        ('tea', 'ชา'),
        ('milk', 'นม'),
        ('bakery', 'ขนม'),
    ]

    TYPE_CHOICES = [
        ('blended', 'ปั่น'),
        ('iced', 'เย็น'),
    ]
    image = models.URLField(max_length=5000, null=True, blank=True)  
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)  # จำนวนสินค้าในแต่ละวัน

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

# คำสั่งซื้อ
class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)  # เวลาสั่งซื้อ
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Order #{self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M')} - ฿{self.total_price}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name="orders")
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # บันทึกราคาต่อชิ้นตอนสั่งซื้อ

    def __str__(self):
        return f"{self.quantity}x {self.product.name} - ฿{self.price * self.quantity}"

# การนับลูกค้าใหม่ในแต่ละวัน
class DailyCustomerCount(models.Model):
    date = models.DateField(default=timezone.now, unique=True)
    count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.date} - {self.count} customers"
