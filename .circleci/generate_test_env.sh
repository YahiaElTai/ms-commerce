#!/usr/bin/env bash

set -e

: "${SERVICE_NAME?Required env variable SERVICE_NAME}"

echo -e "\033[32mGenerating .env for $SERVICE_NAME service"

# Function to generate .env content
generate_env_content() {
    local db_url=$1
    local jwt_key=$2

    echo "NODE_ENV=test"
    echo "DATABASE_URL=$db_url"

    if [ -n "$jwt_key" ]; then
        echo "JWT_KEY=$jwt_key"
    fi
}

# Each service database runs on a specific port
# This helps with local development while running all services together
# This switch statements decide the port number based on the service name
case $SERVICE_NAME in
account)
    db_port=5432
    jwt_key="ajdkjlkajlsd"
    ;;
cart)
    db_port=5435
    ;;
product)
    db_port=5436
    ;;
*)
    db_port=5432
    ;;
esac

DATABASE_URL="postgresql://prisma:prisma@localhost:$db_port/prisma"
env_file_path="/home/circleci/ms-commerce/services/$SERVICE_NAME/.env"

# Generate .env content and write it to the file
generate_env_content "$DATABASE_URL" "$jwt_key" >"$env_file_path"
