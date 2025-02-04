from django.urls import path
from . import views

urlpatterns = [
    path('', views.shop_home, name='shop_home'),
     path('populate-db/', views.populate_db, name='populate-db'),
    path('api/items/', views.api_items, name='api_items'),
       # Other URLs
    path('api/users/', views.api_users, name='api_users'),
     path('clear-db/', views.clear_db, name='clear_db'),
]
