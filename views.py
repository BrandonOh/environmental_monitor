from django.views.generic import TemplateView
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg, Max, Min
from .models import City
from .serializers import (
    CitySerializer,
    CityDetailSerializer,
    AirQualityReadingSerializer,
    WeatherReadingSerializer
)

# Create your views here.

class EnvironmentalMonitorView(TemplateView):
    template_name = 'index.html'

class CityListView(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer

class CityDetailView(generics.RetrieveAPIView):
    queryset = City.objects.all()
    serializer_class = CityDetailSerializer

class CityCurrentReadingsView(APIView):
    def get(self, request, pk):
        try: 
            city = City.objects.get(id = pk)
        except City.DoesNotExist:
            return Response(
                {'error': 'City not found'},
                status = status.HTTP_404_NOT_FOUND
            )

        latest_air = city.air_quality_readings.first()
        latest_weather = city.weather_readings.first()

        return Response({
            'city' : CitySerializer(city).data,
            'air_quality': AirQualityReadingSerializer(latest_air).data if latest_air else None,
            'weather': WeatherReadingSerializer(latest_weather).data if latest_weather else None,
        })
    
class CityHistoricalReadingView(APIView):
    def get(self, request, pk):
        try:
            city = City.objects.get(id = pk)
        except City.DoesNotExist:
            return Response(
                {'error' : 'City not found'},
                status = status.HTTP_404_NOT_FOUND
            )
        
        days = int(request.query_params.get('days', 7))
        cutoff_date = timezone.now() - timedelta(days = days)
        
        air_readings = city.air_quality_readings.filter(
            timestamp__gte = cutoff_date
        ).order_by('timestamp')

        weather_readings = city.weather_readings.filter(
            timestamp__gte = cutoff_date
        ).order_by('timestamp')

        return Response({
            'city' : CitySerializer(city).data,
            'air_quality_readings' : AirQualityReadingSerializer(air_readings, many = True).data,
            'weather_readings' : WeatherReadingSerializer(weather_readings, many = True).data,
            'period_days' : days,
        })
    
class CityStatsView(APIView):
    def get(self, request, pk):
        try:
            city = City.objects.get(id = pk)
        except City.DoesNotExist:
            return Response(
                {'error' : 'City not found'},
                status = status.HTTP_404_NOT_FOUND
            )

        days = int(request.query_params.get('days', 30))
        cutoff_data = timezone.now() - timedelta(days = days)

        air_stats = city.air_quality_readings.filter(
            timestamp__gte = cutoff_data
        ).aggregate(
            avg_aqi = Avg('aqi'),
            max_aqi = Max('aqi'),
            min_aqi = Min('aqi'),
            avg_pm25 = Avg('pm25'),
            avg_pm10 = Avg('pm10')
        )

        weather_stats = city.weather_readings.filter(
            timestamp__gte = cutoff_data
        ).aggregate(
            avg_temp = Avg('temperature'),
            max_temp = Max('temperature'),
            min_temp = Min('temperature'),
            avg_humidity = Avg('humidity'),
        )

        return Response({
            'city:' : CitySerializer(city).data,
            'period_days' : days,
            'air_quality_stats' : air_stats,
            'weather_stats' : weather_stats
        })
    
class CompareCitiesView(APIView):
    def get(self, request):
        city_ids = request.query_params.get('cities', '')

        if not city_ids:
            return Response(
                {'error' : 'Please provide city IDs in query parameter: ?cities=1,2,3'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        try:
            city_ids = [int(id) for id in city_ids.split(',')]
        except ValueError:
            return Response(
                {'error' : 'Invalid city IDs format'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        cities = City.objects.filter(id__in = city_ids)

        comparison_data = []
        for city in cities:
            latest_air = city.air_quality_readings.first()
            latest_weather = city.weather_readings.first()

            comparison_data.append({
                'city' : CitySerializer(city).data,
                'air_quality' : AirQualityReadingSerializer(latest_air).data if latest_air else None,
                'weather' : WeatherReadingSerializer(latest_weather).data if latest_weather else None
            })

        return Response({
            'cities_count': len(comparison_data),
            'comparisons': comparison_data,
        })