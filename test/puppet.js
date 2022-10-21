const puppeteer = require('puppeteer')

const defaults = {
  type: 'jpeg',
  quality: 70,
  fullPage: false
}

const domain = 'www.nbcnews.com'
// www.washingtonpost.com m.huffpost.com

puppeteer.launch().then(async browser => {
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 667, isMobile: true })
  await page.goto(`https://${domain}`)
  // await page.addScriptTag({path: 'lib/hideAds.js'})
  defaults.path = `test/${domain}.jpg`
  await page.screenshot(defaults)

  browser.close()
})
