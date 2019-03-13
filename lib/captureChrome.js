const puppeteer = require('puppeteer')

module.exports.launch = async function () {
  // const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome-unstable';
  const args = ['--no-sandbox'] //, '--disable-setuid-sandbox']
  return puppeteer.launch({ ignoreHTTPSErrors: true, args })
}

module.exports.page = async function capturePage (page, defaults, browser) {
  const {
    url,
    injectFile = defaults.injectFile,
    viewport = defaults.viewport,
    userAgent = defaults.userAgent,
    fullPage = defaults.fullPage,
    quality = defaults.quality
  } = page

  const newPage = await browser.newPage()
  await newPage.setViewport(viewport)
  await newPage.setUserAgent(userAgent)
  await newPage.goto(url, {waitUntil: 'networkidle2'})
  await newPage.addScriptTag({path: injectFile})
  // console.log('page:', { url, viewport, userAgent, fullPage, quality });
  return newPage.screenshot({ type: 'jpeg', quality, viewport, fullPage })
}
