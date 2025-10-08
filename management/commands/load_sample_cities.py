from django.core.management.base import BaseCommand
from environmental_monitor.models import City

class Command(BaseCommand):
    help = 'Loads sample cities into the database'

    def handle(self, *args, **kwargs):
        cities_data = [
            {
                'name': 'New York',
                'country': 'United States',
                'latitude': 40.7128,
                'longitude': -74.0060,
                'population': 8336817,
                'timezone': 'America/New_York'
            },
            {
                'name': 'Los Angeles',
                'country': 'United States',
                'latitude': 34.0522,
                'longitude': -118.2437,
                'population': 3979576,
                'timezone': 'America/Los_Angeles'
            },
            {
                'name': 'London',
                'country': 'United Kingdom',
                'latitude': 51.5074,
                'longitude': -0.1278,
                'population': 8982000,
                'timezone': 'Europe/London'
            },
            {
                'name': 'Tokyo',
                'country': 'Japan',
                'latitude': 35.6762,
                'longitude': 139.6503,
                'population': 13960000,
                'timezone': 'Asia/Tokyo'
            },
            {
                'name': 'Paris',
                'country': 'France',
                'latitude': 48.8566,
                'longitude': 2.3522,
                'population': 2161000,
                'timezone': 'Europe/Paris'
            },
        ]

        # Clear existing cities
        # City.object.all().delete()
        # self.stdout.write('Cleared existing cities')

        for city_data in cities_data:
            city, created = City.objects.get_or_create(
                name = city_data['name'],
                country = city_data['country'],
                defaults = city_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created city: {city.name}, {city.country}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'City already exists: {city.name}, {city.country}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully loaded {len(cities_data)} cities!')
        )