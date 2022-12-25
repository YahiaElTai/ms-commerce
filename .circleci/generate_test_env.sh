#!/usr/bin/env bash

set -e

: "${SERVICE_NAME?Required env variable SERVICE_NAME}"

echo -e "\033[32mGenerating .env for $SERVICE_NAME service"

if [ "$SERVICE_NAME" == "auth" ]; then

    cat <<EOF >/home/circleci/ms-commerce/services/"$SERVICE_NAME"/.env
    NODE_ENV=test
    DATABASE_URL="postgresql://prisma:prisma@localhost:5432/prisma"
    JWT_KEY=ajdkjlkajlsd
EOF

else
    cat <<EOF >/home/circleci/ms-commerce/services/"$SERVICE_NAME"/.env
    NODE_ENV=test
    DATABASE_URL="postgresql://prisma:prisma@localhost:5432/prisma"
EOF

fi
