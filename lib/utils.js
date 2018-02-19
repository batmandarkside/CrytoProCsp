
/**
 *
 * @param {Number} number
 * @returns {string}
 */
export function decimalToHexString(number) {
  let copyNumber = number;
  if (copyNumber < 0) {
    copyNumber = 0xFFFFFFFF + copyNumber + 1;
  }

  return copyNumber.toString(16).toUpperCase();
}

/**
 *
 * @param e
 * @constructor
 */
export function GetMessageFromException(e) {
  let err = e.message;
  if (!err) {
    err = e;
  } else if (e.number) {
    err += `(0x${decimalToHexString(e.number)})`;
  }
  return err;
}