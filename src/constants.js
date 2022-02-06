import { TELEGRAM_BOT_TOKEN } from '../private.js'

const URL_TELEGRAM_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`
export const URL_TELEGRAM_SEND_MESSAGE = URL_TELEGRAM_BASE + '/sendMessage'
export const URL_TELEGRAM_SEND_PHOTO = URL_TELEGRAM_BASE + '/sendPhoto'
export const URL_WORKER_TOWN_LISTING =
  'https://tofunft.com/_next/data/uiyU7dNuiUcTkLJ5BO5LX/en/collection/worker-town/activities.json?category=listing&contracts=7171%2C8370%2C8590&slug=worker-town'

export const defaultRequestTimeout = 3000
