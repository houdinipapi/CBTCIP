from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView,
    EmailVerificationView,
    UserLoginView,
    AuthenticationTestView,
    PasswordResetConfirm,
    PasswordResetRequestView,
    SetNewPasswordView,
    UserLogoutView
)


urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("verify/", EmailVerificationView.as_view(), name="verify"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("test-auth/", AuthenticationTestView.as_view(), name="test-auth"),
    path("password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path(
        "password-reset-confirm/<uidb64>/<token>/",
        PasswordResetConfirm.as_view(),
        name="password-reset-confirm",
    ),
    path("set-new-password/", SetNewPasswordView.as_view(), name="set-new-password"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
