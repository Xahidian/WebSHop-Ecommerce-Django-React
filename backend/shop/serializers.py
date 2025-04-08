from rest_framework import serializers
from .models import Item
from django.contrib.auth.models import User

#class ItemSerializer(serializers.ModelSerializer):
 #   owner = serializers.CharField(source='owner.username', read_only=True)

  #  class Meta:
   #     model = Item
    #    fields = ['id', 'title', 'description', 'price', 'date_added', 'owner']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def get_password(self, obj):
        # Reconstruct the password only for demo/testuser accounts
        if obj.username.startswith("testuser") and obj.username[-1].isdigit():
            return f"pass{obj.username[-1]}"
        return "demo_password"
# serializers.py

# serializers.py
class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)

    class Meta:
        model = Item
        fields = [
            'id', 'title', 'description', 'price', 'image',
            'owner_username', 'owner_id', 'date_added',
            'quantity', 'sold'
        ]