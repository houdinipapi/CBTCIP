from django.db import models

from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.utils.translation import ugettext_lazy as _

from .managers import UserManager
from rest_framework_simplejwt.tokens import RefreshToken

# Constants for authentication providers
AUTH_PROVIDERS = {
    "email": "email",
    "google": "google",
    "facebook": "facebook",
    "instagram": "instagram",
    "twitter": "twitter",
}


# Create your models here.
class User(AbstractUser):
    # User model representing a user in the system
    email = models.EmailField(max_length=100, unique=True, verbose_name=_("Email"))
    first_name = models.CharField(max_length=100, verbose_name=_("First Name"))
    last_name = models.CharField(max_length=100, verbose_name=_("Last Name"))
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(
        max_length=255, default=AUTH_PROVIDERS.get("email"), verbose_name=_("Authentication Provider")
    )

    # Define email as the unique identifier for the user
    USERNAME_FIELD = "email"

    # List of fields required when creating a user
    REQUIRED_FIELDS = ["first_name", "last_name", "email"]

    # Define the custom user manager
    objects = UserManager()

    def __str__(self):
        # String representation of the user object
        return self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def generate_tokens(self):
        # Generate JWT tokens for user authentication
        refresh = RefreshToken.for_user(self)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }
    

class OneTimePassword(models.Model):
    # Model to store the OTP for email verification
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=7, unique=True)

    def __str__(self):
        # String representation of the OTP object
        return f"{self.user.full_name} - passcode"