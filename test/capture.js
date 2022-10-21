const capture = require('../lib/captureChrome')
const manifest = require('../config/manifest.json')
const fs = require('fs')

const { defaults, pages } = manifest

const page = pages.find(page => page.url.includes('washington'))

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
  .then(result => fs.writeFileSync('test/' + page.image, result))
  .then(() => browserRef.close())
  .catch(err => console.log(err))
