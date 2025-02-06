from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import User, Item
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import connection, transaction
import logging

# Initialize logger
logger = logging.getLogger(__name__)

# API to get all items in JSON format
def api_items(request):
    items = Item.objects.all().values('title', 'description', 'price', 'owner__username', 'date_added')
    return JsonResponse(list(items), safe=False)

# Function to populate the database with users and items
# Function to populate the database with users and items
def populate_db(request):
    try:
        # Clear existing users and items
        with transaction.atomic():
            User.objects.all().delete()
            Item.objects.all().delete()

            user_details = []  # Store user information for response

            # Create 6 users
            for i in range(1, 7):
                password = f'pass{i}'  # This is the plaintext password
                user = User.objects.create_user(
                    username=f'testuser{i}',
                    password=password,
                    email=f'testuser{i}@shop.aa'
                )

                # Append user details with plaintext password
                user_details.append({
                    'username': user.username,
                    'email': user.email,
                    'password': password  # Return the plaintext password
                })

                # Create 10 items for the first 3 users (sellers)
                if i <= 3:
                    for j in range(1, 11):
                        Item.objects.create(
                            title=f'Populated Item {j}',
                            description=f'This is a description for item {j}.',
                            price=9.99,
                            owner=user,
                            date_added=timezone.now()
                        )

            # Return the response with the user details including plaintext password
            return JsonResponse({
                'message': 'Database populated successfully!',
                'user_details': user_details  # Include the plaintext passwords
            }, status=200)

    except Exception as e:
        return JsonResponse({"message": f"Error: {str(e)}"}, status=500)

    try:
        # Clear existing users and items
        with transaction.atomic():
            User.objects.all().delete()
            Item.objects.all().delete()

            user_details = []  # Store user information for response

            # Create 6 users
            for i in range(1, 7):
                password = f'pass{i}'  # This is the plaintext password
                user = User.objects.create_user(
                    username=f'testuser{i}',
                    password=password,
                    email=f'testuser{i}@shop.aa'
                )

                # Append user details with plaintext password
                user_details.append({
                    'username': user.username,
                    'email': user.email,
                    'password': password  # Return the plaintext password
                })

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

            # Return the response with the user details including plaintext password
            return JsonResponse({
                'message': 'Database populated successfully!',
                'user_details': user_details  # Include the plaintext passwords
            }, status=200)

    except Exception as e:
        return JsonResponse({"message": f"Error: {str(e)}"}, status=500)

    try:
        # Clear existing users and items
        with transaction.atomic():
            User.objects.all().delete()
            Item.objects.all().delete()

            user_details = []  # Store user information for response

            # Create 6 users
            for i in range(1, 7):
                password = f'pass{i}'
                user = User.objects.create_user(
                    username=f'testuser{i}',
                    password=password,
                    email=f'testuser{i}@shop.aa'
                )

                # Append user details to the list
                user_details.append({
                    'username': user.username,
                    'email': user.email,
                    'password': password  # Include plaintext password in the response
                })

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

            # Return the response as JSON with message and user details
            return JsonResponse({
                'message': 'Database populated successfully!',
                'user_details': user_details  # Include the list of created user details
            }, status=200)

    except Exception as e:
        return JsonResponse({"message": f"Error: {str(e)}"}, status=500)

# Home view for the shop
def shop_home(request):
    return render(request, 'shop/home.html')

# API to get all users in JSON format
# API to get all users in JSON format
def api_users(request):
    users = User.objects.all().values('username', 'email')
    # Add plain text passwords to the response
    user_list = list(users)
    for user in user_list:
        user['password'] = f'pass{user["username"][-1]}'  # Assuming the username ends with a number
    return JsonResponse(user_list, safe=False)
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
