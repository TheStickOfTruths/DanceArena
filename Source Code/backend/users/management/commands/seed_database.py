from django.core.management.base import BaseCommand
from django.core.management import call_command
from users.models import User

class Command(BaseCommand):
    help = "Seeds the database with initial data if it's empty."

    def handle(self, *args, **options):

        if User.objects.exists():
            self.stdout.write(self.style.SUCCESS('Database already seeded. Skipping.'))
            return

        self.stdout.write(self.style.WARNING('Database is empty. Seeding initial data...'))
        
        fixture_file = 'data.json'
        
        try:
            call_command('loaddata', fixture_file)
            self.stdout.write(self.style.SUCCESS(f'Successfully loaded data from {fixture_file}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error loading data: {e}'))