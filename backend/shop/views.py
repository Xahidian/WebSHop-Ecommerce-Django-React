from django.shortcuts import render
from django.http import JsonResponse
from .models import Item
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import connection
import logging

# Initialize logger
logger = logging.getLogger(__name__)

# API to get all items in JSON format
def api_items(request):
    items = Item.objects.all().values('title', 'description', 'price', 'owner__username', 'date_added')
    return JsonResponse(list(items), safe=False)

# Function to populate the database with users and items
def populate_db(request):
    try:
        # Clear existing users and items
        User.objects.all().delete()
        Item.objects.all().delete()

        # Create 6 users
        for i in range(1, 7):
            user = User.objects.create_user(
                username=f'testuser{i}',
                password=f'pass{i}',
                email=f'testuser{i}@shop.aa'
            )

            # Create 10 items for the first 3 users (sellers)
            if i <= 3:
                for j in range(1, 11):
                    Item.objects.create(
                        title=f'Populated Item {j}',
                        description=f'This is a description for item {j}.',
                        price=49.99,
                        owner=user,
                        date_added=timezone.now()
                    )

        # Return success response as JSON
        return JsonResponse({"message": "Database populated successfully!"}, status=200)
    
    except Exception as e:
        # Return error response as JSON in case of exception
        return JsonResponse({"message": f"Error: {str(e)}"}, status=500)

# Home view for the shop
def shop_home(request):
    return render(request, 'shop/home.html')

# API to get all users in JSON format
def api_users(request):
    users = User.objects.all().values('username', 'password', 'email')
    return JsonResponse(list(users), safe=False)

# Function to clear the database
def clear_db(request):
    try:
        logger.info("Starting to clear the database...")
        
        # Clear all records from the tables
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM shop_item;")
            cursor.execute("DELETE FROM auth_user;")
            
            # Reset auto-increment IDs (necessary for SQLite)
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='shop_item';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='auth_user';")
        
        logger.info("Database cleared successfully")
        return JsonResponse({"message": "Database cleared"})
    
    except Exception as e:
        logger.error(f"Error clearing the database: {str(e)}")
        return JsonResponse({"message": f"Error clearing the database: {str(e)}"})
