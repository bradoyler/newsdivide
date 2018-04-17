const puppeteer = require('puppeteer')

const defaults = {
  type: 'jpeg',
  quality: 70,
  fullPage: false
}

puppeteer.launch().then(async browser => {
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 667, isMobile: true })
  await page.goto('https://www.nbcnews.com/mach')
  await page.injectFile('lib/hideEls.js')
  defaults.path = 'test/www.nbcnews.mach.jpg'
  await page.screenshot(defaults)

  // await page.goto('https://www.nbcnews.com');
  // await page.injectFile('lib/hideEls.js');
  // defaults.path = 'test/www.nbcnews.com.jpg';
  // await page.screenshot(defaults);
  //
  // await page.goto('http://m.huffpost.com');
  // await page.injectFile('lib/hideEls.js');
  // defaults.path = 'test/m.huffpost.com.jpg';
  // await page.screenshot(defaults);

  browser.close()
})
