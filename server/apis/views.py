from django.shortcuts import render
from .models import Users
from .serializers import UserSerializer
from rest_framework.generics import ListAPIView

# Create your views here.
class UserList (ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
