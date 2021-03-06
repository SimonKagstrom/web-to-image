#!/usr/bin/env python3

import sys
import os
import shutil
import time
import subprocess

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: XXX <dst-dir> <url> [url...]")
        sys.exit(1)

    child = subprocess.Popen(["chromium", "--no-sandbox", "--headless", "--hide-scrollbars", "--remote-debugging-port=9222", "--disable-gpu", "--unhandled-rejections=none"],
        close_fds=True)
    dst_dir = sys.argv[1]
    urls = []
    for cur in sys.argv[2:]:
        for x in cur.split():
            urls.append(x)

    try:
        os.mkdir(dst_dir)
    except:
        pass

    # Some time for chromium to start
    time.sleep(5)
    # The first seems to be broken for some reason...
    for i in range(0, len(urls)):
        url = urls[i]
        os.system("node get_page.js --url {}".format(url))

    while True:
        if child.poll() != None:
            # Chromium died
            sys.exit(1)

        for i in range(0, len(urls)):
            cur = urls[i]

            # http://127.0.0.1:8123/lovelace/home@5,9  where 5,9 is x and y coordinates
            parts = cur.split('@')
            if len(parts) < 1:
                print("Invalid URL {}".format(cur))
                continue
            url = parts[0]
            extraArgs = ""
            if len(parts) > 1:
                extraArgs = "--click {}".format(parts[1])

            os.system("node get_page.js --url {} {}".format(url, extraArgs))
            try:
                shutil.move("/tmp/desktop.png", "{}/{}.png".format(dst_dir, i))
            except:
                print("Can't move image {}".format(i))
        time.sleep(60)
