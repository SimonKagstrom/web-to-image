FROM balenalib/raspberry-pi-debian:bookworm

## See https://jonathanmh.com/taking-full-page-screenshots-headless-chrome/

RUN rm -rf /var/lib/apt/lists/*
RUN apt-get -y update
RUN apt-get install -y git chromium libpangoft2-1.0-0 npm zile

RUN apt-get autoremove -y
RUN rm -rf /var/lib/apt/lists/*

COPY src/* /app/

WORKDIR /app

RUN npm install puppeteer

CMD python3 /app/main.py "${DST_DIR}" "${URLS}"
