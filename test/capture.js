const capture = require('../lib/captureChrome')
const manifest = require('../lib/data/manifest.json')
const fs = require('fs')

const { defaults, pages } = manifest

const page = pages.find(page => page.url.includes('drudge'))

let browserRef = null
capture.launch()
  .then(browser => {
    browserRef = browser
    return capture.page(page, defaults, browser)
  })
  .then(result => {
    console.log(page, result)
    return result
  })
  .then(result => fs.writeFileSync('test/images/' + page.image, result))
  .then(() => browserRef.close())
  .catch(err => console.log(err))
