# foamy/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, 
    ProductViewSet, 
    InventoryViewSet, 
    LoginView,  # Add this
    LogoutView,  # Add this too
    CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'inventory', InventoryViewSet)

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Custom authentication views
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

]

