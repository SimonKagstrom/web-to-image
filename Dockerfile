FROM balenalib/raspberry-pi-debian:latest

## See https://jonathanmh.com/taking-full-page-screenshots-headless-chrome/

RUN apt-get update
RUN apt-get install -y chromium imagemagick nodejs
RUN apt-get install -y npm

WORKDIR /usr/app
COPY ./src/main.py /usr/app
COPY ./src/get_page.js /usr/app
RUN npm install

RUN npm install minimist chrome-remote-interface

RUN apt-get autoremove -y
RUN rm -rf /var/lib/apt/lists/*

## chromium --no-sandbox --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &
## nodejs other.js
