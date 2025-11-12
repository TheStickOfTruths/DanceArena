set -e

echo "Starting deployment script..."

echo "Applying database migrations..."
python manage.py migrate

echo "Seeding database if empty..."
python manage.py seed_database

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn server..."
gunicorn DanceArena.wsgi