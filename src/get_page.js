// From https://jonathanmh.com/taking-full-page-screenshots-headless-chrome/

const CDP = require('chrome-remote-interface');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const targetURL = argv.url || 'http://192.168.1.164:8123/lovelace/home';
const clickCoordinates = argv.click || '';
const viewport = [800,536];
const screenshotDelay = 20000; // ms
const fullPage = argv.fullPage || false;

if(fullPage){
  console.log("will capture full page")
}

https://github.com/cyrus-and/chrome-remote-interface/issues/67
function click(client, x, y) {
  const options = {
      x: x,
      y: y,
      button: 'left',
      clickCount: 1
  };

  options.type = 'mousePressed';
  client.Input.dispatchMouseEvent(options);

  options.type = 'mouseReleased';
  client.Input.dispatchMouseEvent(options);
}

CDP(async function(client){
  const {DOM, Emulation, Network, Page, Runtime} = client;

  // Enable events on domains we are interested in.
  await Page.enable();
  await DOM.enable();
  await Network.enable();

  // change these for your tests or make them configurable via argv
  var device = {
    width: viewport[0],
    height: viewport[1],
    deviceScaleFactor: 0,
    mobile: false,
    fitWindow: false
  };

  // set viewport and visible size
  await Emulation.setDeviceMetricsOverride(device);
  await Emulation.setVisibleSize({width: viewport[0], height: viewport[1]});

  await Page.navigate({url: targetURL});

  await Page.loadEventFired(async() => {
    if (fullPage) {
      const {root: {nodeId: documentNodeId}} = await DOM.getDocument();
      const {nodeId: bodyNodeId} = await DOM.querySelector({
        selector: 'body',
        nodeId: documentNodeId,
      });

      const {model: {height}} = await DOM.getBoxModel({nodeId: bodyNodeId});
      await Emulation.setVisibleSize({width: device.width, height: height});
      await Emulation.setDeviceMetricsOverride({width: device.width, height:height, screenWidth: device.width, screenHeight: height, deviceScaleFactor: 1, fitWindow: false, mobile: false});
      await Emulation.setPageScaleFactor({pageScaleFactor:1});
    }
  });

  setTimeout(async function() {
    if (clickCoordinates !== '') {
      parts = clickCoordinates.split(",");
      click(client, Number(parts[0]), Number(parts[1]));
      console.log("Clicking at", Number(parts[0]), Number(parts[1]))
    }

    setTimeout(async function() {
      const screenshot = await Page.captureScreenshot({format: "png", fromSurface: true});
      const buffer = new Buffer.from(screenshot.data, 'base64');
      fs.writeFile('/tmp/desktop.png', buffer, 'base64', function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log('Screenshot saved');
        }
      });
      client.close();
    }, screenshotDelay);
  }, clickCoordinates === '' ? 0 : screenshotDelay);

}).on('error', err => {
  console.error('Cannot connect to browser:', err);
});
