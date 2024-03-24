from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .serializers import (
    RegisterUserSerializer,
    LoginUserSerializer,
    ResetPasswordRequestSerializer,
    SetNewPasswordSerializer,
    LogoutUserSerializer,
)
from .utils import send_otp
from .models import User, OneTimePassword


# Create your views here.
class RegisterUserView(GenericAPIView):
    """
    View for registering a new user
    """
    serializer_class = RegisterUserSerializer

    def post(self, request):
        # Register a new user
        user_data = request.data
        serializer = self.serializer_class(data=user_data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user = serializer.data
            send_otp(user["email"])

            return Response(
                {
                    "status": "success",
                    "message": f"{user['first_name']} registered successfully! Please check your email for the OTP.",
                    "data": user,
                },
                status=status.HTTP_201_CREATED,
            )
        
        else:
            return Response(
                {
                    "status": "error",
                    "message": "User registration failed!",
                    "data": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )