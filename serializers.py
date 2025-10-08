from rest_framework import serializers
from .models import City, AirQualityReading, WeatherReading

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = [
            'id',
            'name',
            'country',
            'latitude',
            'longitude',
            'population',
            'timezone',
            'created_at',
            'updated_at'
        ]

class AirQualityReadingSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source = 'city.name', read_only = True)
    aqi_category = serializers.SerializerMethodField()

    class Meta:
        model = AirQualityReading
        fields = [
            'id',
            'city',
            'city_name',
            'timestamp',
            'aqi',
            'aqi_category',
            'pm25',
            'pm10',
            'co',
            'no2',
            'o3',
            'so2',
            'created_at'
        ]

    def get_aqi_category(self, obj):
        return obj.get_aqi_category()
    
class WeatherReadingSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source = 'city.name', read_only = True)
    temperature_fahrenheit = serializers.SerializerMethodField()

    class Meta:
        model = WeatherReading
        fields = [
            'id',
            'city',
            'city_name',
            'timestamp',
            'temperature',
            'temperature_fahrenheit',
            'feels_like',
            'humidity',
            'pressure',
            'wind_speed',
            'wind_direction',
            'clouds',
            'visibility',
            'weather_main',
            'weather_description',
            'created_at'
        ]

    def get_temperature_fahrenheit(self, obj):
        return obj.temperature_fahrenheit()

class CityDetailSerializer(serializers.ModelSerializer):
    latest_air_quality = serializers.SerializerMethodField()
    latest_weather = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = [
            'id',
            'name',
            'country',
            'latitude',
            'longitude',
            'population',
            'timezone',
            'latest_air_quality',
            'latest_weather',
        ]
    
    def get_latest_air_quality(self, obj):
        latest = obj.air_quality_readings.first()

        if latest:
            return AirQualityReadingSerializer(latest).data
        return None
    
    def get_latest_weather(self, obj):
        latest = obj.weather_readings.first()
        if latest:
            return WeatherReadingSerializer(latest).data
        return None