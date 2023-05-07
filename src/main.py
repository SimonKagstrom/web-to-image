#!/usr/bin/env python3

import sys
import os
import shutil
import time
import subprocess

def run(dst_dir : str, urls : str):

    # The first seems to be broken for some reason...
    for i in range(0, len(urls)):
        url = urls[i]
        os.system("node get_page.js --url {}".format(url))

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

        os.system("node screenshot.js --url {} {}".format(url, extraArgs))
        try:
            shutil.move("/tmp/desktop.png", "{}/{}.png".format(dst_dir, i))
        except:
            print("Can't move image {}".format(i))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: XXX <dst-dir> <url> [url...]")
        sys.exit(1)

    dst_dir = sys.argv[1]
    urls = []
    for cur in sys.argv[2:]:
        for x in cur.split():
            urls.append(x)

    try:
        os.mkdir(dst_dir)
    except:
        pass

    while True:
        run(dst_dir, urls)
        time.sleep(60)
