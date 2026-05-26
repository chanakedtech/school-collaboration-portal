#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Seeding demo data..."
python manage.py seed_demo

echo "Starting server..."
exec python manage.py runserver 0.0.0.0:8000
