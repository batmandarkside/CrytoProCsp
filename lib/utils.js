"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decimalToHexString = decimalToHexString;
exports.GetMessageFromException = GetMessageFromException;

/**
 *
 * @param {Number} number
 * @returns {string}
 */
function decimalToHexString(number) {
  var copyNumber = number;
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
function GetMessageFromException(e) {
  var err = e.message;
  if (!err) {
    err = e;
  } else if (e.number) {
    err += "(0x" + decimalToHexString(e.number) + ")";
  }
  return err;
}