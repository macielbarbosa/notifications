import axios from 'axios'
import { URL_TELEGRAM_SEND_MESSAGE, URL_TELEGRAM_SEND_PHOTO } from './constants.js'

export const sendMessage = async (text, chat_id) => {
  try {
    await axios.post(URL_TELEGRAM_SEND_MESSAGE, {
      chat_id,
      text,
      parse_mode: 'HTML',
    })
  } catch (error) {
    console.warn('[WARN] Fail on send message to user', chat_id)
    throw error
  }
}

export const sendPhoto = async (photo, chat_id, caption) => {
  try {
    await axios.post(URL_TELEGRAM_SEND_PHOTO, {
      chat_id,
      caption,
      parse_mode: 'HTML',
      photo,
    })
  } catch (error) {
    console.warn('[WARN] Fail on send message to user', chat_id)
    throw error
  }
}
