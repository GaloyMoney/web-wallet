#!/bin/bash

# wget https://raw.githubusercontent.com/openoms/galoy/self-hosting/scripts/deploy-raspiblitz.sh -O deploy-raspiblitz.sh
# sh -x deploy-raspiblitz.sh on
# sh -x deploy-raspiblitz.sh web-wallet

# command info
if [ $# -eq 0 ] || [ "$1" = "-h" ] || [ "$1" = "-help" ]; then
  echo "
Script to install the Galoy web-wallet.
deploy-raspiblitz.sh [on|off] [?testnet|mainnet] [?githubUser] [?branch]
Installs the latest main by default.

Requirements:
RaspiBlitz v1.7.2+ patched to 'dev'
LND on Testnet activated"
  exit 1
fi

# install vars
if [ $# -gt 1 ]; then
  NETWORK="$2"
else
  NETWORK="testnet"
fi

if [ $# -gt 2 ]; then
  githubUser="$3"
else
  #githubUser="GaloyMoney"
  githubUser="openoms"
fi

if [ $# -gt 3 ]; then
  githubBranch="$4"
else
  #githubBranch="main"
  githubBranch="self-hosting"
fi


# install
if [ "$1" = "on" ]; then
  echo
  echo "# Build web-wallet"
  cd /home/galoy/ || exit 1
  sudo -u galoy git clone https://github.com/${githubUser}/web-wallet
  cd web-wallet || exit 1
  if [ ${#githubBranch} -gt 0 ]; then
    sudo -u galoy git checkout ${githubBranch}
  fi

  # mod .envrc
  sudo -u galoy sed -i "s/export NETWORK=.*/export NETWORK=${NETWORK}/g" ./.envrc
  sudo -u galoy sed -i "s/export NODE_ENV=.*/export NODE_ENV=production/g" ./.envrc
  # change port to collision
  sudo -u galoy sed -i "s/3000/4030/g" ./.envrc

  # start
  sudo -u galoy docker compose down
  sudo -u galoy bash -c '. ./.envrc; ./scripts/generate-env.sh'
  sudo -u galoy docker compose up postgres -d
  sudo -u galoy docker compose up kratos -d
  sudo -u galoy docker compose up kratos-migrate -d
  sudo -u galoy docker compose up mailslurper -d
  sudo -u galoy docker compose up web-wallet -d

  # galoy-web-wallet_ssl
  if ! [ -f /etc/nginx/sites-available/web-wallet_ssl.conf ]; then
    sudo cp /home/galoy/web-wallet/scripts/assets/web-wallet_ssl.conf /etc/nginx/sites-available/web-wallet_ssl.conf
  fi
  sudo ln -sf /etc/nginx/sites-available/web-wallet_ssl.conf /etc/nginx/sites-enabled/

  DOCKER_HOST_IP=$(ip addr show docker0 | awk '/inet/ {print $2}' | cut -d'/' -f1)
  sudo sed -i "s#proxy_pass http://127.0.0.1:4030;#proxy_pass http://$DOCKER_HOST_IP:4030;#g" /etc/nginx/sites-available/web-wallet_ssl.conf

  sudo nginx -t || exit 1
  sudo systemctl reload nginx
  sudo ufw allow 4031 comment "galoy-web-wallet_ssl"

  echo "# Monitor the service with:"
  echo "docker container logs -f --details web-wallet-web-wallet-1"
  echo "# Connect to the web-wallet on: https://$(hostname -I|awk '{print $1}'):4031/graphql"
fi

if [ "$1" = "off" ]; then

  # web-wallet
  cd /home/galoy/web-wallet
  sudo -u galoy docker compose down
  cd
  sudo rm -rf /home/galoy/web-wallet
  sudo ufw deny 4031
  sudo rm /etc/nginx/sites-available/web-wallet_ssl.conf
  sudo rm /etc/nginx/sites-enabled/web-wallet_ssl.conf

  sudo nginx -t || exit 1
  sudo systemctl reload nginx
fi