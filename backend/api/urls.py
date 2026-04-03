from django.urls import path
from .views import RegisterView, LoginView, LogoutView, RefreshView, ProfileView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", RefreshView.as_view(), name="refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
]
