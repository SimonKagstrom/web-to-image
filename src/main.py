#!/usr/bin/env python3

import sys
import os
import shutil
import time

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
    print(urls)

    while True:
        for i in range(0, len(urls)):
            url = urls[i]
            os.system("node get_page.js --url {}".format(url))
            shutil.move("desktop.png", "{}/{}.png".format(dst_dir, i))
        time.sleep(60)
