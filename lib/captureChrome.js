const puppeteer = require('puppeteer');

const defUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
const defaults = {
  type: 'jpeg',
  quality: 70,
  viewport: { width: 375, height: 667, isMobile: true }
};

module.exports.launch = async function () {
  // const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome-unstable';
  const args = ['--no-sandbox'];
  return puppeteer.launch({ args });
};

module.exports.page = async function capturePage ({ url, viewport = defaults.viewport, userAgent = defUserAgent, fullPage = false }, browser) {
  const { type, quality } = defaults;
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.setUserAgent(userAgent);
  await page.goto(url);
  await page.injectFile('lib/hideEls.js');
  console.log('viewport', viewport);
  return page.screenshot({ type, quality, viewport, fullPage });
};
