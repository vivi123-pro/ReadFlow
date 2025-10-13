from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    interests_display = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ('interests', 'interests_display', 'preferred_reading_mode', 'reading_level')
    
    def get_interests_display(self, obj):
        return obj.get_interests_display()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    interests = serializers.ListField(
        child=serializers.ChoiceField(choices=UserProfile.INTEREST_CHOICES),
        required=True,
        write_only=True
    )
    preferred_reading_mode = serializers.ChoiceField(
        choices=UserProfile.READING_MODE_CHOICES,
        default='direct',
        required=False
    )
    reading_level = serializers.ChoiceField(
        choices=UserProfile.READING_LEVEL_CHOICES, 
        default='casual',
        required=False
    )
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 
                 'interests', 'preferred_reading_mode', 'reading_level')
    
    def validate_interests(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("Please select at least one interest.")
        if len(value) > 5:
            raise serializers.ValidationError("Please select up to 5 interests.")
        return value
    
    def create(self, validated_data):
        # Extract profile data
        interests = validated_data.pop('interests')
        preferred_reading_mode = validated_data.pop('preferred_reading_mode', 'direct')
        reading_level = validated_data.pop('reading_level', 'casual')
        
        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # Create user profile
        UserProfile.objects.create(
            user=user,
            interests=interests,
            preferred_reading_mode=preferred_reading_mode,
            reading_level=reading_level
        )
        
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include username and password.')
        
        return data

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'storage_used', 'max_storage', 'profile')