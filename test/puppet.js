const puppeteer = require('puppeteer')

const defaults = {
  type: 'jpeg',
  quality: 70,
  fullPage: false
}

const domain = 'drudgereport.com'

puppeteer.launch().then(async browser => {
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 667, isMobile: true })
  await page.goto(`https://${domain}`)
  await page.addScriptTag({path: 'lib/hideAds.js'})
  defaults.path = `test/images/${domain}.jpg`
  await page.screenshot(defaults)

  // await page.goto('https://www.nbcnews.com');
  // await page.addScriptTag({path: 'lib/hideAds.js'})
  // defaults.path = 'test/www.nbcnews.com.jpg';
  // await page.screenshot(defaults);
  //
  // await page.goto('http://m.huffpost.com');
  // await page.addScriptTag({path: 'lib/hideAds.js'})
  // defaults.path = 'test/m.huffpost.com.jpg';
  // await page.screenshot(defaults);

  browser.close()
})
