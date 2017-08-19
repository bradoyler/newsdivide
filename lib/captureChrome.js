const puppeteer = require('puppeteer');

const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
const defaults = {
  type: 'jpeg',
  quality: 70,
  fullPage: false
};

module.exports.launch = async function () {
  // const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome-unstable';
  const args = ['--no-sandbox'];
  return puppeteer.launch({ args });
};

module.exports.page = async function capturePage (_page, options, browser) {
  const _options = Object.assign({}, options, _page.options);
  const { width, height } = _options.screenSize;

  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: true });
  await page.setUserAgent(userAgent);
  await page.goto(_page.url);
  await page.injectFile('lib/hideEls.js');
  return page.screenshot(defaults);
};
