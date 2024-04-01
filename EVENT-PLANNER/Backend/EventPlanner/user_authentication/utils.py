import random
from django.core.mail import EmailMessage
from .models import User, OneTimePassword
from django.conf import settings


def generate_otp():
    otp = random.randint(100000, 999999)
    # print (otp)
    return otp


def send_code(email):
    Subject = "One Time Password"
    otp = generate_otp()
    user = User.objects.get(email=email)
    current_site = "myAuth.com"
    message = f"Hello {user.first_name},\n\nYour one time password is {otp}.\n\nRegards,\nEventPlanner Team"
    from_email = settings.DEFAULT_FROM_EMAIL

    OneTimePassword.objects.create(user=user, otp_code=otp)

    email = EmailMessage(
        subject=Subject, body=message, from_email=from_email, to=[email]
    )
    email.send(fail_silently=True)


def send_normal_email(data):
    email = EmailMessage(
        subject=data["subject"],
        body=data["message"],
        from_email=settings.EMAIL_HOST_USER,
        to=[data["to"]],
    )
    email.send(fail_silently=True)