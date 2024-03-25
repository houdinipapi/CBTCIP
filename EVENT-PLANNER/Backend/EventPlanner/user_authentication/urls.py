from django.urls import path
# from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserRegistrationView


urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
]
