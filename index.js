import { URL_WORKER_TOWN_LISTING } from './src/constants.js'
import puppeteer from 'puppeteer'
import randomUseragent from 'random-useragent'
import JSONdb from 'simple-json-db'

import { sleep } from './src/utils.js'
import { sendPhoto } from './src/telegram.js'
import { CHAT_ID } from './private.js'

var page
var browser
var db = new JSONdb('./database.json')

const execute = async () => {
  try {
    await page.goto(URL_WORKER_TOWN_LISTING, { waitUntil: 'networkidle0' })
    await sleep(60)
    const bodyHTML = await page.evaluate(() => document.body.querySelector('pre').innerHTML)

    const data = JSON.parse(bodyHTML).pageProps.data.searchResp.data.filter((d) =>
      ['offer_change', 'offer_listing'].includes(d.type),
    )
    const updates = data.map((d) => ({
      id: d.id,
      price: d.price,
      name: d.nft.meta.name,
      image: d.nft.meta.image,
    }))
    const newUpdates = updates.filter((u) => u.id > db.get('lastId'))
    console.log(newUpdates)
    for (const u of newUpdates.reverse()) {
      await sendPhoto(u.image, CHAT_ID, `<b>${u.name ? u.name : 'Landlord Chest'}</b>\n${u.price} BNB`)
    }
    if (newUpdates.length > 0) db.set('lastId', newUpdates[0].id)
  } catch (err) {
    console.error(err)
  }
}

export const service = async () => {
  try {
    console.log('[LOG] Starting service')

    const USER_AGENT =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1)\nAppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36'

    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_BIN || null,
      ignoreHTTPSErrors: true,
      dumpio: false,
    })
    page = await browser.newPage()
    const userAgent = randomUseragent.getRandom()
    const UA = userAgent || USER_AGENT

    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    })

    await page.setUserAgent(UA)
    await page.setJavaScriptEnabled(true)
    await page.setDefaultNavigationTimeout(0)

    while (true) {
      await execute()
      await sleep(Math.floor(Math.random() * 30))
    }
  } catch (error) {
    console.log('[WARN] Service error. Restarting...', error)
    await browser.close()
    await sleep(5000)
    service()
  }
}

service()
