from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'preferred_reading_mode', 'reading_level', 'created_at')
    list_filter = ('preferred_reading_mode', 'reading_level')
    search_fields = ('user__username', 'user__email')
    
    def get_interests_display(self, obj):
        return ", ".join(obj.get_interests_display())
    get_interests_display.short_description = 'Interests'