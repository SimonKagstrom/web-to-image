#!/bin/bash

chromium --no-sandbox --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &
sleep 5
python3 /app/main.py $*
