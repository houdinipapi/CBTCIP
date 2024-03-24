from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    def validate_email_address(self, email):
        # Validate the format of the email address
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(_("Invalid email address!"))
        
    def create_user(self, email, first_name, last_name, password, **extra_fields):
        # Create a regular user

        # Validate email address format
        if not email:
            raise ValueError(_("The Email field must be set!"))
        self.validate_email_address(email)

        # Ensure first name and last name are set
        if not first_name:
            raise ValueError(_("The First Name field must be set!"))
        if not last_name:
            raise ValueError(_("The Last Name field must be set!"))
        
        # Create the user object
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )

        # Set the password for the user
        user.set_password(password)

        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, first_name, last_name, password, **extra_fields):
        # Create a superuser

        # Set default values for superuser fields
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_verified", True)

        # Ensure superuser has necessary permissions
        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True!"))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True!"))
        
        # Create superuser
        return self.create_user(email, first_name, last_name, password, **extra_fields)