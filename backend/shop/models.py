from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Item(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='item_images/', null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    date_added = models.DateTimeField(default=timezone.now)
    quantity = models.PositiveIntegerField(default=10)
    sold = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class RegisteredUserInfo(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField()
    password = models.CharField(max_length=128)
    is_test = models.BooleanField(default=False)

    def __str__(self):
        return self.username
