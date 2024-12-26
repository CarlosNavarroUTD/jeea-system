# foamy/serializers.py
from rest_framework import serializers
from .models import Category, Product, Inventory
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff']

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model
    """
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model
    Includes nested representation of category
    """
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), 
        source='category', 
        write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_id', 
            'size', 'description', 'unit_price', 
            'current_stock'
        ]

class InventorySerializer(serializers.ModelSerializer):
    """
    Serializer for Inventory model
    Includes nested representation of product
    """
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), 
        source='product', 
        write_only=True
    )

    class Meta:
        model = Inventory
        fields = [
            'id', 'product', 'product_id', 
            'entry_date', 'quantity', 'unit_cost'
        ]
        read_only_fields = ['entry_date']