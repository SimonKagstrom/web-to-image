/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const puppeteer = require('puppeteer');

const argv = require('minimist')(process.argv.slice(2));

const targetURL = argv.url || 'http://192.168.1.226:8123/lovelace/home';
const clickCoordinates = argv.click || '';

// https://stackoverflow.com/questions/46919013/puppeteer-wait-n-seconds-before-continuing-to-the-next-line
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: '/usr/bin/chromium',
        args: ["--no-sandbox", "--disabled-setupid-sandbox"],
    })
    const page = await browser.newPage();

    await page.goto(targetURL);
    await delay(40000);

    if (clickCoordinates !== '') {
        const parts = clickCoordinates.split(",");
        await page.mouse.click(Number(parts[0]), Number(parts[1]), { button: 'left' })
        console.log("Clicking at", Number(parts[0]), Number(parts[1]))
        await delay(2000);
      }
    await page.screenshot({ path: '/tmp/desktop.png', fullPage: true });
    await browser.close();
})();
