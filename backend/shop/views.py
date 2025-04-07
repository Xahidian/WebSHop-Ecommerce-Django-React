from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.db import connection, transaction
import logging

from django.contrib.auth.models import User
from .models import Item
from .serializers import ItemSerializer, UserSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .models import RegisteredUserInfo  # import your new model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response




# Initialize logger
logger = logging.getLogger(__name__)

# ✅ API to get all items
@api_view(['GET'])
@permission_classes([AllowAny])  # ✅ This allows public access
def api_items(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)


# ✅ API to get all users
@api_view(['GET'])
@permission_classes([AllowAny])
def api_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# ✅ API to add item (auth required)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_add_item(request):
    print("🔐 Received headers:", request.headers)  # ✅ Debug header log

    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
# ✅ API to register new user


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error': 'All fields are required.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)

    # ✅ Save raw password for display
    RegisteredUserInfo.objects.create(username=username, email=email, password=password)

    return Response({'message': 'User registered successfully!'}, status=201)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_registered_users(request):
    test_users = list(RegisteredUserInfo.objects.filter(is_test=True).values('username', 'email', 'password'))
    real_users = list(RegisteredUserInfo.objects.filter(is_test=False).values('username', 'email', 'password'))

    return Response({
        'test_users': test_users,
        'real_users': real_users
    })


# ✅ Populate database
def populate_db(request):
    try:
        with transaction.atomic():
            # ✅ Only delete test users
            User.objects.filter(username__startswith='testuser').delete()
            Item.objects.all().delete()
            RegisteredUserInfo.objects.filter(is_test=True).delete()

            user_details = []

            for i in range(1, 7):
                password = f'pass{i}'
                user = User.objects.create_user(
                    username=f'testuser{i}',
                    password=password,
                    email=f'testuser{i}@shop.aa'
                )

                # ✅ Save test user with is_test=True
                RegisteredUserInfo.objects.create(
                    username=user.username,
                    email=user.email,
                    password=password,
                    is_test=True
                )

                user_details.append({
                    'username': user.username,
                    'email': user.email,
                    'password': password
                })

                if i <= 3:
                    for j in range(1, 11):
                        Item.objects.create(
                            title=f'Populated Item {j}',
                            description=f'Description for item {j}',
                            price=9.99,
                            owner=user,
                            date_added=timezone.now()
                        )

            return JsonResponse({
                'message': 'Database populated successfully!',
                'user_details': user_details
            }, status=200)

    except Exception as e:
        logger.error(f"Error populating DB: {str(e)}")
        return JsonResponse({'message': f'Error: {str(e)}'}, status=500)


# ✅ Clear DB
def clear_db(request):
    try:
        with transaction.atomic():
            # Delete all entries
            Item.objects.all().delete()
            User.objects.all().delete()
            RegisteredUserInfo.objects.all().delete()

        return JsonResponse({"message": "Database cleared"})
    except Exception as e:
        logger.error(f"Error clearing DB: {str(e)}")
        return JsonResponse({"message": f"Error: {str(e)}"})

# Optional homepage
def shop_home(request):
    return render(request, 'shop/home.html')
#change password
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        return Response({'error': 'Old and new passwords are required.'}, status=400)

    if not user.check_password(old_password):
        return Response({'error': 'Old password is incorrect.'}, status=400)

    user.set_password(new_password)
    user.save()

    # ✅ Update password in RegisteredUserInfo if it exists
    try:
        registered = RegisteredUserInfo.objects.get(username=user.username, email=user.email)
        registered.password = new_password  # update raw password (demo only!)
        registered.save()
    except RegisteredUserInfo.DoesNotExist:
        pass  # Safe fallback

    return Response({'message': 'Password updated successfully!'}, status=200)
