'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CERT_KEY_ENCIPHERMENT_KEY_USAGE = exports.CERT_KEY_ENCIPHERMENT_KEY_USAGE = 0x10;
var CERT_DATA_ENCIPHERMENT_KEY_USAGE = exports.CERT_DATA_ENCIPHERMENT_KEY_USAGE = 0x20;
var CERT_DIGITAL_SIGNATURE_KEY_USAGE = exports.CERT_DIGITAL_SIGNATURE_KEY_USAGE = 0x80;
var CERT_NON_REPUDIATION_KEY_USAGE = exports.CERT_NON_REPUDIATION_KEY_USAGE = 0x40;
var XCN_CERT_NAME_STR_NONE = exports.XCN_CERT_NAME_STR_NONE = 0;
var PROVIDER_NAME = exports.PROVIDER_NAME = 'Crypto-Pro GOST R 34.10-2001 Cryptographic Service Provider';
// export const REGISTRATION_AUTHORITY_USER = '1.2.643.2.2.34.6';
var CX509CertificateRequestPkcs10 = exports.CX509CertificateRequestPkcs10 = 'X509Enrollment.CX509CertificateRequestPkcs10';
var CX509ExtensionEnhancedKeyUsage = exports.CX509ExtensionEnhancedKeyUsage = 'X509Enrollment.CX509ExtensionEnhancedKeyUsage';
var CX509ExtensionKeyUsage = exports.CX509ExtensionKeyUsage = 'X509Enrollment.CX509ExtensionKeyUsage';
var CX500DistinguishedName = exports.CX500DistinguishedName = 'X509Enrollment.CX500DistinguishedName';
var CX509PrivateKey = exports.CX509PrivateKey = 'X509Enrollment.CX509PrivateKey';
var CX509Enrollment = exports.CX509Enrollment = 'X509Enrollment.CX509Enrollment';
var CObjectIds = exports.CObjectIds = 'X509Enrollment.CObjectIds';
var CObjectId = exports.CObjectId = 'X509Enrollment.CObjectId';

// -----BEGIN NEW CERTIFICATE REQUEST---—
var CREATE_REQUEST = exports.CREATE_REQUEST = 0x3;