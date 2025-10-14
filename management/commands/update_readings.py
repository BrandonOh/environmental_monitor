import requests
from django.core.management.base import BaseCommand
from environmental_monitor.models import City, AirQualityReading, WeatherReading
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone
from zoneinfo import ZoneInfo

class Command(BaseCommand):
    help = 'Fetch and update weather/air quality data from OpenWeatherMap'

    def handle(self, *args, **kwargs):
        api_key = settings.OPENWEATHER_API_KEY
        cities = City.objects.all()

        for city in cities:
            weather_url = f'http://api.openweathermap.org/data/2.5/weather?lat={city.latitude}&lon={city.longitude}&appid={api_key}&units=metric'
            weather_response = requests.get(weather_url)

            if weather_response.status_code == 200:
                weather_data = weather_response.json()
                WeatherReading.objects.create(
                    city = city,
                    timestamp = datetime.fromtimestamp(weather_data['dt'], tz = ZoneInfo('UTC')),
                    temperature = weather_data['main']['temp'],
                    feels_like = weather_data['main']['feels_like'],
                    humidity = weather_data['main']['humidity'],
                    pressure = weather_data['main']['pressure'],
                    wind_speed = weather_data['wind']['speed'],
                    wind_direction = weather_data['wind']['deg'],
                    clouds = weather_data['clouds']['all'],
                    visibility = weather_data['visibility'],
                    weather_main = weather_data['weather'][0]['main'],
                    weather_description = weather_data['weather'][0]['description'],
                )
            else:
                self.stdout.write(self.style.ERROR(f'Weather API failed for {city.name}: {weather_response.status_code}'))

            air_url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={city.latitude}&lon={city.longitude}&appid={api_key}'
            air_response = requests.get(air_url)

            if air_response.status_code == 200:
                air_data = air_response.json()
                components = air_data['list'][0]['components']

                AirQualityReading.objects.create(
                    city = city,
                    timestamp = datetime.fromtimestamp(air_data['list'][0]['dt'], tz = ZoneInfo('UTC')),
                    aqi = air_data['list'][0]['main']['aqi'],
                    pm25 = components['pm2_5'],
                    pm10 = components['pm10'],
                    co = components.get('co', 0),
                    no2 = components.get('no2', 0),
                    o3 = components.get('o3', 0),
                    so2 = components.get('so2', 0),
                )
            else:
                self.stdout.write(self.style.ERROR(f'Air Quality API failed for {city.name}: {air_response.status_code}'))

            self.stdout.write(self.style.SUCCESS(f'Updated {city.name}'))
        
        cutoff_date = timezone.now() - timedelta(days = 30)
        AirQualityReading.objects.filter(timestamp__lt = cutoff_date).delete()
        WeatherReading.objects.filter(timestamp__lt = cutoff_date).delete()

        self.stdout.write(self.style.SUCCESS(f'Cleaned old readings before {cutoff_date}'))