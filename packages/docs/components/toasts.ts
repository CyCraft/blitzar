import { isArray, isPlainObject } from 'is-what'
import Toaster from "@meforma/vue-toaster/src/api"

const toaster = Toaster()

/**
 * Show a toast at the bottom of the screen
 */
export function showToast(message: string, payload: any, origin?: any): void {
  if (origin === 'default') return
  if (isPlainObject(payload) && payload.origin === 'default') return
  const details = isPlainObject(payload) || isArray(payload) ? JSON.stringify(payload, undefined, 2) : payload
  if (details) {
    toaster.show(message + `\n` + details)
    return
  }
  toaster.show(message)
}
