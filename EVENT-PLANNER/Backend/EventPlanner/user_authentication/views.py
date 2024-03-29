from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    PasswordResetRequestSerializer,
    SetNewPasswordSerializer,
    UserLogoutSerializer,
)
from rest_framework.response import Response
from rest_framework import status
from .utils import send_code
from .models import OneTimePassword
from rest_framework.permissions import IsAuthenticated
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .models import User


# Create your views here.
class UserRegistrationView(GenericAPIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        user_data = request.data
        serializer = self.serializer_class(data=user_data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user = serializer.data

            # Send email verification to user
            send_code(user["email"])

            return Response(
                {
                    "data": user,
                    "status": "Success",
                    "message": f"{user['first_name']} registered successfully! Check your email for account verification."
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {
                    "status": "Error",
                    "message": "User registration failed!",
                    "data": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
           )
        

# Verifying user's email
class EmailVerificationView(GenericAPIView):
    def post(self, request):
        code = request.data.get("otp")
        try:
            otp_obj = OneTimePassword.objects.get(otp_code=code)
            user = otp_obj.user
            if not user.is_verified:
                user.is_verified = True
                user.save()

                return Response(
                    {
                        "Status": "Success",
                        "message": f"{user.first_name}'s email has been verified successfully!",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "status": "Failed",
                        "message": "Email already verified!",
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        except OneTimePassword.DoesNotExist:
            return Response(
                {
                    "status": "Failed",
                    "message": "Invalid code. Please try again!",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        

# Logging in user
class UserLoginView(GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request):
        user_data = request.data
        serializer = self.serializer_class(
            data=user_data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        return Response(
            {
                "status": "Success",
                "message": "User logged in successfully!",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    

# Testing if the authentication feature is working
class AuthenticationTestView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data

        return Response(
            {
                "status": "Success",
                "message": "User authenticated successfully!",
                "user": user_data,
            },
            status=status.HTTP_200_OK,
        )
    

# Requesting Password Reset
class PasswordResetRequestView(GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid(raise_exception=True):
            serializer.save()

            return Response(
                {
                    "status": "Success",
                    "message": "Password reset link sent to your email!",
                },
                status=status.HTTP_200_OK,
            )
        
        else:
            return Response(
                {
                    "status": "Error",
                    "message": "Password reset request failed!",
                    "data": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        

# Confirming Password Reset
class PasswordResetConfirm(GenericAPIView):
    def post(self, request, uidb64, token):
        try:
            uid = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response(
                    {
                        "status": "Failed",
                        "message": "Invalid token. Please try again!",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            else:

                return Response(
                    {
                        "status": "Success",
                        "message": "Valid Credentials!",
                        "uidb64": uidb64,
                        "token": token,
                    },
                    status=status.HTTP_200_OK,
                )
            
        except DjangoUnicodeDecodeError:
            return Response(
                {
                    "status": "Failed",
                    "message": "Invalid token. Please try again!",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except User.DoesNotExist:
            return Response(
                {
                    "status": "Failed",
                    "message": "User does not exist!",
                },
                status=status.HTTP_404_NOT_FOUND,
            )


# Setting New Password
class SetNewPasswordView(GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {
                "status": "Success",
                "message": "Password reset successful!",
            },
            status=status.HTTP_200_OK,
        )


# Logging out user
class UserLogoutView(GenericAPIView):
    serializer_class = UserLogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "status": "Success",
                "message": "User logged out successfully!",
            },
            status=status.HTTP_200_OK,
        )
