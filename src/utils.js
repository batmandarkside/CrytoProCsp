// @flow
/**
 *
 * @param {Number} number
 * @returns {string}
 */
export function decimalToHexString (number: number): string {
  let copyNumber = number
  if (copyNumber < 0) {
    copyNumber = 0xFFFFFFFF + copyNumber + 1
  }

  return copyNumber.toString(16).toUpperCase()
}

/**
 *
 * @param e
 * @constructor
 */
export function GetMessageFromException (e: { message?: string, number?: number }): { message?: string, number?: number } | string {
  let err = e.message
  if (!err) {
    err = e
  } else if (e.number) {
    err += `(0x${decimalToHexString(e.number)})`
  }
  return err
}
