import { isString, isDate } from 'is-what'
import { date } from 'quasar'
const { formatDate, adjustDate } = date

export function dateStamp (date, format) {
  if (isString(date)) date = new Date(date)
  if (!isDate(date)) return 'null'
  if (format === 'short') return formatDate(date, 'YYYY/MM/DD')
  if (isString(format)) return formatDate(date, format)
  return formatDate(date, 'YYYY年MM月DD日')
}

export function timeStamp (date) {
  if (isString(date)) date = new Date(date)
  if (!isDate(date)) return '00:00'
  return formatDate(date, 'HH:mm')
}

export function dateTimeStamp (date) {
  return dateStamp(date) + ' ' + timeStamp(date)
}

/**
 * Create a new date object from a dateStamp and timeStamp
 *
 * @export
 * @param {(string|date)} dateStamp eg. 2019-12-31 - a date string or date object
 * @param {string} timeStamp eg. 23:59 time in the 24h format
 * @returns {date}
 */
export function makeDateFromStamps (dateStamp, timeStamp) {
  let date = dateStamp
  if (isString(date)) date = new Date(date)
  if (!isDate(date)) throw new Error('invalid date parameter')
  if (!isString(timeStamp)) return date
  const hours = Number(timeStamp.split(':')[0])
  const minutes = Number(timeStamp.split(':')[1])
  return adjustDate(date, { hours, minutes })
}

export function numberToHourTimestamp (number) {
  if (number < 0) {
    number = 24 + number
  }
  const numberAsString = number < 10 ? `0${String(number)}` : String(number)
  return `${numberAsString}:00`
}
