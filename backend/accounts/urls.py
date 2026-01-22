from django.urls import path
from . import views

urlpatterns = [
    path('register/user/', views.register_user, name='register_user'),
    path('register/service-provider/', views.register_service_provider, name='register_service_provider'),
    path('login/', views.login, name='login'),
    path('me/', views.get_current_user, name='get_current_user'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('service-providers/', views.ServiceProviderListView.as_view(), name='service_provider_list'),
    path('service-providers/<int:pk>/', views.ServiceProviderDetailView.as_view(), name='service_provider_detail'),
]
