# foamy/admin.py
from django.contrib import admin
from .models import Category, Product, Inventory

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for Category model
    """
    list_display = ('name', 'description')
    search_fields = ('name', 'description')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin configuration for Product model
    """
    list_display = (
        'name', 'category', 'size', 
        'unit_price', 'current_stock'
    )
    list_filter = ('category',)
    search_fields = ('name', 'description')
    list_editable = ('unit_price', 'current_stock')

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for Inventory model
    """
    list_display = (
        'product', 'entry_date', 
        'quantity', 'unit_cost'
    )
    list_filter = ('entry_date', 'product__category')
    search_fields = ('product__name',)