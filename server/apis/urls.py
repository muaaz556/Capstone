from django.urls import path
from apis import views

urlpatterns = [
    path('users/', views.UserList.as_view()),
]