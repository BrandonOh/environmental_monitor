from django.urls import path
from . import views

app_name = 'environmental_monitor'

urlpatterns = [
    
    path('', views.EnvironmentalMonitorView.as_view(), name = 'home'),
    path('api/cities/', views.CityListView.as_view(), name = 'city-list'),
    path('api/cities/<int:pk>/', views.CityDetailView.as_view(), name = 'city-detail'),
    path('api/cities/<int:pk>/current/', views.CityCurrentReadingsView.as_view(), name = "city-current"),
    path('api/cities/<int:pk>/readings/', views.CityHistoricalReadingView.as_view(), name = 'city-readings'),
    path('api/cities/<int:city_id>/stats', views.CityStatsView.as_view(), name = 'city-readings'),
    path('api/compare/', views.CompareCitiesView.as_view(), name = 'compare-cities'),
]