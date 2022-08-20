#!/bin/bash
cd /home/ubuntu
sudo apt-get update
sudo apt-get -y install git
git clone https://github.com/joanroamora/movie-analyst-ui.git
sudo apt-get -y install nodejs
sudo apt-get -y install npm
wait
cd movie-analyst-ui
npm config set strict-ssl false
wait
sudo npm install express@4.15.4
wait
sudo npm install superagent@3.6.0
wait
sudo npm install ejs@2.5.7
wait
BACK_HOST="10.0.0.213" node server.js