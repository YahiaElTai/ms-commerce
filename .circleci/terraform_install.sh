#!/usr/bin/env bash

set -e

TERRAFORM_VERSION="1.4.6"

sudo apt-get update
sudo apt-get install -y wget unzip

wget "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip"
unzip "terraform_${TERRAFORM_VERSION}_linux_amd64.zip"

sudo mv terraform /usr/local/bin/

rm "terraform_${TERRAFORM_VERSION}_linux_amd64.zip"

echo -e "\033[32mInstalled terraform version:"

terraform version
