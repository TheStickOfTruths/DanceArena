from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with initial data if it's empty."

    def handle(self, *args, **options):
        if User.objects.exists():
            self.stdout.write(self.style.SUCCESS('Database already has users. Skipping seed.'))
            return

        self.stdout.write(self.style.WARNING('Database is empty. Seeding initial data...'))
        
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        fixture_file = 'seed_data.json'
        
        try:
            ignore_nonexistent = True 
            call_command('loaddata', fixture_file)
            self.stdout.write(self.style.SUCCESS(f'Successfully loaded data from {fixture_file}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error loading data: {e}'))