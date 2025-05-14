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
from .models import Purchase





# Initialize logger
logger = logging.getLogger(__name__)

# ✅ API to get all items
@api_view(['GET'])
@permission_classes([AllowAny])  # ✅ This allows public access
def api_items(request):
    items = Item.objects.filter(quantity__gt=0, sold=False)
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
        serializer.save(owner=request.user, quantity=1)
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
                        image_path = 'image/Product1.jpg'
                        Item.objects.create(
        title=f'Populated Item {j}',
        description=f'Description for item {j}',
        price=9.99,
        owner=user,
        quantity=10,
        date_added=timezone.now(),
        image=image_path
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
#user not able to add his own items
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    item_id = request.data.get('item_id')

    if not item_id:
        return Response({"error": "Missing item_id in request."}, status=400)

    try:
        item = Item.objects.get(id=item_id)

        if item.owner == user:
            return Response({"error": "You cannot add your own item to the cart."}, status=403)

        # ✅ Don't decrease quantity here
        return Response({"success": "Item added to cart."}, status=200)

    except Item.DoesNotExist:
        return Response({"error": "Item not found."}, status=404)


# Add "My Inventory" API
# shop/views.py

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_inventory(request):
    user = request.user
    on_sale = Item.objects.filter(owner=user, quantity__gt=0)
    sold = Item.objects.filter(owner=user, quantity=0)

    return Response({
        "on_sale": ItemSerializer(on_sale, many=True).data,
        "sold": ItemSerializer(sold, many=True).data,
    })
#checkout API endpoint in views.py to process cart purchase:
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    user = request.user
    cart_items = request.data.get("items", [])

    for entry in cart_items:
        try:
            item = Item.objects.get(id=entry["id"])
            if item.quantity >= entry["quantity"]:
                item.quantity -= entry["quantity"]
                if item.quantity == 0:
                    item.sold = True
                item.save()
            else:
                return Response({"error": f"Not enough stock for item {item.title}"}, status=400)
        except Item.DoesNotExist:
            return Response({"error": f"Item with ID {entry['id']} not found."}, status=404)

    return Response({"success": "Purchase completed."}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_item(request):
    user = request.user
    item_id = request.data.get('item_id')
    quantity = int(request.data.get('quantity', 1))  # default to 1

    if not item_id:
        return Response({"error": "Missing item_id."}, status=400)

    try:
        item = Item.objects.get(id=item_id)

        if item.quantity < quantity:
            return Response({"error": "Not enough stock available."}, status=400)

        item.quantity -= quantity
        if item.quantity == 0:
            item.sold = True
        item.save()

        # ✅ Create a purchase record
        Purchase.objects.create(
            buyer=user,
            item=item,
            quantity=quantity,
            purchase_price=item.price
        )

        return Response({"success": "Purchase completed."}, status=200)

    except Item.DoesNotExist:
        return Response({"error": "Item not found."}, status=404)

# edit item price & quantity
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def edit_item(request, item_id):
    user = request.user

    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return Response({'error': 'Item not found.'}, status=404)

    if item.owner != user:
        return Response({'error': 'You do not have permission to edit this item.'}, status=403)

    if item.quantity <= 0:
        return Response({'error': 'Cannot edit item that is sold out.'}, status=400)

    price = request.data.get('price')
    quantity = request.data.get('quantity')

    if price is not None:
        item.price = price
    if quantity is not None:
        item.quantity = quantity

    item.save()
    return Response({'success': 'Item updated successfully.'})
#handle search
@api_view(['GET'])
@permission_classes([AllowAny])
def search_items(request):
    query = request.GET.get('q', '')
    items = Item.objects.filter(title__icontains=query)
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)
#latest_item_data
@api_view(['GET'])
@permission_classes([AllowAny])
def latest_item_data(request, item_id):
    try:
        # Get the item from the database.
        item = Item.objects.get(pk=item_id)
    except Item.DoesNotExist:
        return Response({'error': 'Item not found.'}, status=404)
    
    # Determine availability; adjust logic as needed.
    # For example, if an item is sold out (or has sold flag) then mark as unavailable.
    available = (item.quantity > 0) and (not item.sold)
    
    # Prepare response data.
    data = {
        "price": item.price,
        "available": available,
        "quantity": item.quantity,  # New field: current available quantity.
    }
    return Response(data, status=200)
# Add a Backend API to Return Purchases
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_purchases(request):
    user = request.user
    purchases = Purchase.objects.filter(buyer=user).select_related('item').order_by('-date')
    data = [
        {
            "id": purchase.item.id,
            "title": purchase.item.title,
            "description": purchase.item.description,
            "price": float(purchase.purchase_price),
            "image": purchase.item.image.url if purchase.item.image else None,
            "quantity": purchase.quantity
        }
        for purchase in purchases
    ]
    return Response(data)
