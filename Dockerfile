FROM balenalib/raspberry-pi-debian:latest

## See https://jonathanmh.com/taking-full-page-screenshots-headless-chrome/

RUN apt-get -y update
RUN apt-get install -y chromium nodejs
RUN apt-get install -y npm

COPY src/* /app/

WORKDIR /app
RUN npm install

RUN npm install minimist chrome-remote-interface

RUN apt-get autoremove -y
RUN rm -rf /var/lib/apt/lists/*

CMD /app/script.sh "${DST_DIR}" "${URLS}"