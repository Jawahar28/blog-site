from django.urls import path, include
from . import views

from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup_view, name='signup'),
    path('post/<int:post_id>/',views.post_detail, name = 'post_detail'),
    path('api/', include(router.urls))
]