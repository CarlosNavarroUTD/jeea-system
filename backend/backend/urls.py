# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin site
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('foamy.urls')),
    
    # Optional: DRF browsable API login/logout views
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)