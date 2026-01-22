from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RelocationViewSet

router = DefaultRouter()
router.register(r'', RelocationViewSet, basename='relocation')

urlpatterns = [
    path('', include(router.urls)),
]
