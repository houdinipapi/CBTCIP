import random
from django.core.mail import EmailMessage
from .models import User, OneTimePassword
from django.conf import settings


def generate_otp():
    """
    Generate a random 6-digit one-time password
    """
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    return otp


def send_otp(email):
    """
    Send the OTP to the user's email address
    """
    subject = "Email Verification OTP"
    otp = generate_otp()

    print(f"Generated OTP: {otp}")  # Temporary, for testing purposes

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Handle the case where the user does not exist
        print(f"User with email {email} does not exist!")
        return

    current_site = "myAuth.com"  # Consider using get_current_site(request) in production
    email_body = (
        f"Hi {user.first_name},\n\n"
        f"Please use the following OTP to verify your email address:\n\n"
        f"OTP: {otp}\n\n"
        f"Regards,\n"
        f"MyAuth Team"
    )
    from_email = settings.DEFAULT_FROM_EMAIL

    # Save the OTP in the database
    OneTimePassword.objects.create(user=user, otp=otp)

    # Send the email
    send_email = EmailMessage(
        subject=subject, body=email_body, from_email=from_email, to=[email]
    )
    send_email.send(fail_silently=True)



def send_email(data):
    """
    Send an email to the user
    """
    subject = data["email_subject"]
    body = data["email_body"]
    from_email = settings.EMAIL_HOST_USER,
    to = data["to_email"]

    email = EmailMessage(subject, body, from_email, to)
    email.send()