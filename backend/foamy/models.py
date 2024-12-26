# foamy/models.py
from django.db import models
from django.core.validators import MinValueValidator

class Category(models.Model):
    """
    Model representing product categories
    Corresponds to Categorias table in the original schema
    """
    name = models.CharField(
        max_length=100, 
        unique=True, 
        verbose_name="Category Name"
    )
    description = models.TextField(
        blank=True, 
        null=True, 
        verbose_name="Category Description"
    )

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(models.Model):
    """
    Model representing products
    Corresponds to Productos table in the original schema
    """
    name = models.CharField(
        max_length=200, 
        verbose_name="Product Name"
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='products',
        verbose_name="Product Category"
    )
    size = models.CharField(
        max_length=50, 
        blank=True, 
        null=True, 
        verbose_name="Product Size"
    )
    description = models.TextField(
        blank=True, 
        null=True, 
        verbose_name="Product Description"
    )
    unit_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        verbose_name="Unit Price"
    )
    current_stock = models.IntegerField(
        default=0, 
        validators=[MinValueValidator(0)],
        verbose_name="Current Stock"
    )

    class Meta:
        verbose_name_plural = "Products"
        ordering = ['name']

    def __str__(self):
        return self.name

class Inventory(models.Model):
    """
    Model representing inventory entries
    Corresponds to Inventario table in the original schema
    """
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='inventory_entries',
        verbose_name="Product"
    )
    entry_date = models.DateField(
        auto_now_add=True, 
        verbose_name="Entry Date"
    )
    quantity = models.IntegerField(
        validators=[MinValueValidator(1)],
        verbose_name="Quantity"
    )
    unit_cost = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        verbose_name="Unit Cost"
    )

    class Meta:
        verbose_name_plural = "Inventory Entries"
        ordering = ['-entry_date']

    def __str__(self):
        return f"{self.product.name} - {self.entry_date}"

    def save(self, *args, **kwargs):
        """
        Override save method to update product's current stock
        when a new inventory entry is created
        """
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            # Update the current stock of the product
            product = self.product
            product.current_stock += self.quantity
            product.save()