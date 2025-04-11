from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
# ✅ Import JWT views from SimpleJWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    # TokenRefreshView,
)

urlpatterns = [
    # 🔹 Homepage and Admin Utilities
    path('', views.shop_home, name='shop_home'),
    path('populate-db/', views.populate_db, name='populate-db'),
    path('clear-db/', views.clear_db, name='clear-db'),

    # 🔹 Item and User APIs
    path('api/items/', views.api_items, name='api_items'),
    path('api/users/', views.api_users, name='api_users'),
    path('api/items/add/', views.api_add_item, name='api_add_item'),
   path('api/user-inventory/', views.user_inventory, name='user_inventory'),
path('api/add-to-cart/', views.add_to_cart, name='add_to_cart'),
path('api/checkout/', views.checkout, name='checkout'),
path('api/items/<int:item_id>/', views.edit_item, name='edit_item'),
path('api/items/<int:item_id>/latest/', views.latest_item_data, name='latest_item_data'),

path('api/items/search/', views.search_items, name='search_items'),

   path('api/purchase-item/', views.purchase_item, name='purchase_item'),
path('api/my-purchases/', views.user_purchases, name='user_purchases'),
path('api/user-purchases/', views.user_purchases, name='user_purchases'),





    # 🔹 Auth-related Endpoints
    path('register/', views.register_user, name='register'),
    path('api/change-password/', views.change_password, name='change_password'),

    # 🔹 Raw user info for PopulationDb
    path('api/raw-users/', views.api_registered_users, name='api_registered_users'),

    # 🔐 JWT Token Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 