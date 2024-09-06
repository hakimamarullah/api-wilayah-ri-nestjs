#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e
set -o pipefail

# Define log file
LOG_FILE="logs.out"

# Function to clean up logs file
cleanup() {
  echo "Cleaning up old logs..."
  rm -f "$LOG_FILE"
}

check_db() {
  local retries=30
  local wait_time=5
  local host="localhost"
  local port="5440"

  echo "Checking if the database is up..."

  while ((retries > 0)); do
    if pg_isready -h "$host" -p "$port" -U micro > /dev/null 2>&1; then
      echo "Database is up and running."
      return 0
    else
      echo "Database is not up yet. Retrying in $wait_time seconds..."
      sleep "$wait_time"
      ((retries--))
    fi
  done

  echo "Database did not become available in time."
  exit 1
}


cleanup

# Start the database service
echo "Starting database..."
docker-compose up -d postgresql

# Set environment variables
export DATABASE_URL="postgresql://micro:micro@localhost:5440/micro?schema=micro"
export SERVER_PORT=8080

# Prisma configuration
export PRISMA_MAX_RETRIES=10
export PRISMA_RETRY_INTERVAL=1000


echo "Checking database readiness"
check_db

# Run linting
npm run lint

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application service
echo "Starting application..."
docker-compose up --build -d app

# Stream logs to file and ensure any failure is captured
echo "Streaming logs to $LOG_FILE..."
docker-compose logs -f app > "$LOG_FILE" 2>&1 &

# Notify that deployment is done
echo "DEPLOYMENT DONE"