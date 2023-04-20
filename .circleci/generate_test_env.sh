#!/usr/bin/env bash

set -e

: "${SERVICE_NAME?Required env variable SERVICE_NAME}"

echo -e "\033[32mGenerating .env for $SERVICE_NAME service"

# Each service database runs on a specific port
# This helps with local development while running all services together
# This switch statements decide the port number based on the service name
case $SERVICE_NAME in

account)
    DATABASE_URL=postgresql://prisma:prisma@localhost:5432/prisma
    ;;

cart)
    DATABASE_URL=postgresql://prisma:prisma@localhost:5435/prisma
    ;;

product)
    DATABASE_URL=postgresql://prisma:prisma@localhost:5436/prisma
    ;;

*)
    DATABASE_URL=postgresql://prisma:prisma@localhost:5432/prisma
    ;;
esac

if [ "$SERVICE_NAME" == "account" ]; then

    cat <<EOF >/home/circleci/ms-commerce/services/"$SERVICE_NAME"/.env
    NODE_ENV=test
    DATABASE_URL="$DATABASE_URL"
    JWT_KEY=ajdkjlkajlsd
EOF

else
    cat <<EOF >/home/circleci/ms-commerce/services/"$SERVICE_NAME"/.env
    NODE_ENV=test
    DATABASE_URL="$DATABASE_URL"
EOF

fi
