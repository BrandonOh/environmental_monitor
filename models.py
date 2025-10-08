from django.db import models
from django.utils import timezone

# Create your models here.

class City(models.Model):
    name = models.CharField(max_length = 100)
    country = models.CharField(max_length = 100)
    latitude = models.DecimalField(max_digits = 9, decimal_places = 6)
    longitude = models.DecimalField(max_digits = 9, decimal_places = 6)
    population = models.IntegerField(null = True, blank = True)
    timezone = models.CharField(max_length = 50, default = 'UTC')
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    class Meta:
        verbose_name_plural = "Cities"
        ordering = ['name']
        indexes = [
            models.Index(fields = ['name', 'country']),
        ]
    
    def __str__(self):
        return f"{self.name}, {self.country}"
    
class AirQualityReading(models.Model):
    city = models.ForeignKey(City, on_delete = models.CASCADE, related_name = 'air_quality_readings')
    timestamp = models.DateTimeField(db_index = True)
    # Air Quality Index (AQI)
    aqi = models.IntegerField()
    # Pollutant Measure in micrograms per cubic meter
    pm25 = models.FloatField(null = True, blank = True)
    # Partical Matter: Particles < 10 mictometers
    pm10 = models.FloatField(null = True, blank = True)
    # Carbon Monoxide
    co = models.FloatField( null = True, blank = True)
    # Nitrogen Dioxide
    no2 = models.FloatField(null = True, blank = True)
    # Ozone
    o3 = models.FloatField(null = True, blank = True)
    # Sulfur Dioxide
    so2 = models.FloatField(null = True, blank = True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

        indexes = [
            models.Index(fields = ['city', '-timestamp']),
            models.Index(fields = ['-timestamp']),
        ]

        verbose_name = "Air Quality Reading"
        verbose_name_plural = "Air Quality Readings"

    def __str__(self):
        return f"{self.city.name} - AQI {self.aqi} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
    
    def get_aqi_category(self):
        if self.aqi <= 50:
            return "Good"
        elif self.aqi <= 100:
            return "Moderate"
        elif self.aqi <= 150:
            return "Unhealthy for Sensitive Groups"
        elif self.aqi <= 200:
            return "Unhealthy"
        elif self.aqi <= 300:
            return "Very Unhealthy"
        else:
            return "Hazardous"
        
class WeatherReading(models.Model):
    city = models.ForeignKey(City, on_delete = models.CASCADE, related_name = 'weather_readings')
    timestamp = models.DateTimeField(db_index = True)
    temperature = models.FloatField()
    feels_like = models.FloatField(null = True, blank = True)
    humidity = models.IntegerField()
    pressure = models.FloatField()
    wind_speed = models.FloatField(null = True, blank = True)
    wind_direction = models.IntegerField(null = True, blank = True)
    clouds = models.IntegerField(null = True, blank = True)
    visibility = models.IntegerField(null = True, blank = True)
    weather_main = models.CharField(max_length = 50, null = True, blank = True)
    weather_description = models.CharField(max_length = 100, null = True, blank = True)
    created_at = models.DateTimeField(auto_now_add = True)

    class Meta:
        ordering = ['-timestamp']

        indexes = [
            models.Index(fields = ['city', '-timestamp']),
            models.Index(fields=['-timestamp']),
        ]

        verbose_name = "Weather Reading"
        verbose_name_plural = "Weather Readings"
    
    def __str__(self):
        return f"{self.city.name} - {self.temperature}°C at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
    
    def temperature_fahrenheit(self):
        return (self.temperature * 9/5) + 32