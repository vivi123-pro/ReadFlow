from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    storage_used = models.BigIntegerField(default=0)  # in bytes
    max_storage = models.BigIntegerField(default=100*1024*1024)  # 100MB default
    
    def __str__(self):
        return self.username