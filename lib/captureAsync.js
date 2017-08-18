const puppeteer = require('puppeteer');

const defaults = {
  type: 'jpeg',
  quality: 70,
  fullPage: false
};

module.exports.launch = async function () {
  // const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome-unstable';
  // const args = ['--no-sandbox'];
  return puppeteer.launch();
};

module.exports.page = async function capturePage (_page, options, browser) {
  const _options = Object.assign({}, options, _page.options);
  const { width, height } = _options.screenSize;

  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: true });
  await page.goto(_page.url);
  await page.injectFile('lib/hideEls.js');
  return page.screenshot(defaults);
};
