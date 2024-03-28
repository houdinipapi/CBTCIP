from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import (
    UserRegistrationSerializer,
)
from rest_framework.response import Response
from rest_framework import status
from .utils import send_code


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