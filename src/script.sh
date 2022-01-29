#!/bin/sh

chromium --no-sandbox --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &
sleep 10
python3 /app/main.py $1 $2 $3 $4
