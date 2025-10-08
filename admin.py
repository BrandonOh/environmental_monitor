from django.contrib import admin
from .models import City, AirQualityReading, WeatherReading
# Register your models here.

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'latitude', 'longitude', 'population']

    search_fields = ['name', 'country']

    list_filter = ['country']

@admin.register(AirQualityReading)
class AirQualityReadingAdmin(admin.ModelAdmin):
    list_display = ['city', 'timestamp', 'aqi', 'pm25', 'pm10']
    list_filter = ['city', 'timestamp']
    date_hierarchy = 'timestamp'

    readonly_fields = ['created_at']

@admin.register(WeatherReading)
class WeatherReadingAdmin(admin.ModelAdmin):
    list_display = ['city', 'timestamp', 'temperature', 'humidity', 'weather_main']
    list_filter = ['city', 'timestamp', 'weather_main']
    date_hierarchy = 'timestamp'
    readonly_fields = ['created_at']