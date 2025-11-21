from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    storage_used = models.BigIntegerField(default=0)
    max_storage = models.BigIntegerField(default=100*1024*1024)

    # Remove USERNAME_FIELD override or handle it properly
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']  # Add username here
    
    # Fix: Add username field explicitly if needed
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'
    )
    
    # Override with custom related_name
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )
    
    def __str__(self):
        return self.email  # Return email instead of username

class UserProfile(models.Model):
    INTEREST_CHOICES = [
        ('fiction', '📚 Fiction'),
        ('technology', '💻 Technology'), 
        ('business', '💼 Business'),
        ('science', '🔬 Science'),
        ('history', '🏛️ History'),
        ('biography', '📝 Biography'),
        ('fantasy', '🐉 Fantasy'),
        ('mystery', '🕵️ Mystery'),
        ('romance', '💖 Romance'),
        ('self_help', '🌟 Self Help'),
        ('academic', '🎓 Academic'),
        ('comics', '🦸 Comics'),
    ]
    
    READING_MODE_CHOICES = [
        ('direct', '📄 Direct Read'),
        ('story', '📖 Story Read'),
    ]
    
    READING_LEVEL_CHOICES = [
        ('casual', '😊 Casual'),
        ('detailed', '🎯 Detailed'), 
        ('academic', '📊 Academic'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    interests = models.JSONField(default=list)  # Store multiple interests
    preferred_reading_mode = models.CharField(
        max_length=20, 
        choices=READING_MODE_CHOICES,
        default='direct'
    )
    reading_level = models.CharField(
        max_length=20,
        choices=READING_LEVEL_CHOICES,
        default='casual'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    def get_interests_display(self):
        """Get human-readable interest names"""
        interest_dict = dict(self.INTEREST_CHOICES)
        return [interest_dict.get(interest, interest) for interest in self.interests]