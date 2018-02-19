'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginInfoAsync = exports.signerAsync = exports.signerSync = exports.signSync = exports.signAsync = exports.getCertAsync = exports.getCertSync = exports.isOnTokenSync = exports.isOnTokenAsync = exports.isPluginAsync = undefined;

var createPKCS10AsyncRequest = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref6, cryptoServiceConf) {
    var _this = this;

    var _ref6$ulk = _ref6.ulk,
        branchName = _ref6$ulk.branchName,
        email = _ref6$ulk.email,
        cityName = _ref6$ulk.cityName,
        name = _ref6$ulk.name,
        orgINN = _ref6$ulk.orgINN;

    var exportableKey, keyUsageOIDs, keyUsageOIDsSplit, _prepareStringForDist, fNameReplace, branchNameReplace, cityNameReplace, _PrivateKey, DistinguishedName, objExtensionKeyUsage, cObjectIds, cObjectId, objX509ExtensionEnhancedKeyUsage, CertificateRequestPkcs10, Enroll, X509Extensions, _pkcs, _containerName;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            exportableKey = cryptoServiceConf.keyGenConf.exportableKey, keyUsageOIDs = cryptoServiceConf.keyUsageOIDs;
            keyUsageOIDsSplit = keyUsageOIDs.split(';');
            _prepareStringForDist = prepareStringForDistinguishedNameEncode({ branchName: branchName, cityName: cityName, name: name }), fNameReplace = _prepareStringForDist.fNameReplace, branchNameReplace = _prepareStringForDist.branchNameReplace, cityNameReplace = _prepareStringForDist.cityNameReplace;
            _context7.prev = 3;
            _context7.next = 6;
            return window.cadesplugin.CreateObjectAsync(_constants.CX509PrivateKey);

          case 6:
            _PrivateKey = _context7.sent;
            _context7.next = 9;
            return window.cadesplugin.CreateObjectAsync(_constants.CX500DistinguishedName);

          case 9:
            DistinguishedName = _context7.sent;
            _context7.next = 12;
            return window.cadesplugin.CreateObjectAsync(_constants.CX509ExtensionKeyUsage);

          case 12:
            objExtensionKeyUsage = _context7.sent;
            _context7.next = 15;
            return window.cadesplugin.CreateObjectAsync(_constants.CObjectIds);

          case 15:
            cObjectIds = _context7.sent;
            _context7.next = 18;
            return window.cadesplugin.CreateObjectAsync(_constants.CObjectId);

          case 18:
            cObjectId = _context7.sent;
            _context7.next = 21;
            return window.cadesplugin.CreateObjectAsync(_constants.CX509ExtensionEnhancedKeyUsage);

          case 21:
            objX509ExtensionEnhancedKeyUsage = _context7.sent;
            _context7.next = 24;
            return window.cadesplugin.CreateObjectAsync(_constants.CX509CertificateRequestPkcs10);

          case 24:
            CertificateRequestPkcs10 = _context7.sent;
            _context7.next = 27;
            return window.cadesplugin.CreateObjectAsync(_constants.CX509Enrollment);

          case 27:
            Enroll = _context7.sent;
            _context7.next = 30;
            return _PrivateKey.propset_KeyUsage(2);

          case 30:
            _context7.next = 32;
            return _PrivateKey.propset_KeySpec(1);

          case 32:
            _context7.next = 34;
            return _PrivateKey.propset_ProviderName(_constants.PROVIDER_NAME);

          case 34:
            _context7.next = 36;
            return _PrivateKey.propset_ExportPolicy(exportableKey === 'YES' ? 1 : 0x00000000);

          case 36:
            _context7.next = 38;
            return _PrivateKey.propset_ProviderType(75);

          case 38:
            _context7.next = 40;
            return CertificateRequestPkcs10.InitializeFromPrivateKey(0x1, _PrivateKey, '');

          case 40:
            _context7.next = 42;
            return DistinguishedName.Encode('CN="' + fNameReplace + '";OU="' + branchNameReplace + '";O="' + orgINN + '";L="' + cityNameReplace + '";C="RU";E="' + email + '"');

          case 42:
            _context7.next = 44;
            return CertificateRequestPkcs10.propset_Subject(DistinguishedName);

          case 44:
            _context7.next = 46;
            return objExtensionKeyUsage.InitializeEncode(_constants.CERT_KEY_ENCIPHERMENT_KEY_USAGE | // eslint-disable-line space-infix-ops, no-bitwise
            // eslint-disable-line space-infix-ops, no-bitwise
            _constants.CERT_DATA_ENCIPHERMENT_KEY_USAGE | _constants.CERT_DIGITAL_SIGNATURE_KEY_USAGE | _constants.CERT_NON_REPUDIATION_KEY_USAGE);

          case 46:
            _context7.next = 48;
            return CertificateRequestPkcs10.X509Extensions;

          case 48:
            X509Extensions = _context7.sent;
            _context7.next = 51;
            return X509Extensions.Add(objExtensionKeyUsage);

          case 51:

            keyUsageOIDsSplit.map(function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(keyUsage) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return cObjectId.InitializeFromValue(keyUsage);

                      case 2:
                        return _context6.abrupt('return', _context6.sent);

                      case 3:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                }, _callee6, _this);
              }));

              return function (_x3) {
                return _ref7.apply(this, arguments);
              };
            }());

            // yield cObjectId.InitializeFromValue(REGISTRATION_AUTHORITY_USER);
            _context7.next = 54;
            return cObjectIds.Add(cObjectId);

          case 54:
            _context7.next = 56;
            return objX509ExtensionEnhancedKeyUsage.InitializeEncode(cObjectIds);

          case 56:
            _context7.next = 58;
            return X509Extensions.Add(objX509ExtensionEnhancedKeyUsage);

          case 58:
            _context7.next = 60;
            return Enroll.InitializeFromRequest(CertificateRequestPkcs10);

          case 60:
            _context7.next = 62;
            return Enroll.CreateRequest(_constants.CREATE_REQUEST);

          case 62:
            _pkcs = _context7.sent;
            _context7.next = 65;
            return _PrivateKey.ContainerName;

          case 65:
            _containerName = _context7.sent;
            return _context7.abrupt('return', {
              pkcs10: _pkcs,
              containerName: _containerName
            });

          case 69:
            _context7.prev = 69;
            _context7.t0 = _context7['catch'](3);

            console.info('Failed createPKCS10AsyncRequest', errorMessage(_context7.t0)); // eslint-disable-line no-console
            throw _context7.t0;

          case 73:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[3, 69]]);
  }));

  return function createPKCS10AsyncRequest(_x, _x2) {
    return _ref5.apply(this, arguments);
  };
}();

exports.pluginInfoSync = pluginInfoSync;
exports.errorMessage = errorMessage;
exports.versionToString = versionToString;
exports.createPKCS10SyncRequest = createPKCS10SyncRequest;

var _constants = require('./constants');

var _cadesplugin_api = require('./cadesplugin_api');

var _cadesplugin_api2 = _interopRequireDefault(_cadesplugin_api);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var isPluginAsync = exports.isPluginAsync = function isPluginAsync() {
  return !!window.cadesplugin.CreateObjectAsync;
};

/**
 *
 * @param cert
 */
var isOnTokenAsync = exports.isOnTokenAsync = function isOnTokenAsync(cert) {
  return window.cadesplugin.async_spawn(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var privateKey, uniqueContainerName;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return cert.PrivateKey;

          case 2:
            privateKey = _context.sent;
            _context.next = 5;
            return privateKey.UniqueContainerName;

          case 5:
            uniqueContainerName = _context.sent;
            return _context.abrupt('return', !uniqueContainerName.startsWith('REGISTRY'));

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
};

/**
 *
 * @param cert
 */
var isOnTokenSync = exports.isOnTokenSync = function isOnTokenSync(cert) {
  return !cert.PrivateKey.UniqueContainerName.startsWith('REGISTRY');
};

/**
 *
 * @param certBase64
 * @returns {*}
 */
var getCertSync = exports.getCertSync = function getCertSync(certBase64) {
  var cert = null;
  try {
    cert = window.cadesplugin.CreateObject('CAdESCOM.Certificate');
    cert.Import(certBase64);
    cert.FindPrivateKey();
  } catch (ex) {
    console.info('Failed to create CAdESCOM.Certificate: ', ex.message); // eslint-disable-line no-console
    throw new Error('sign.private_key_not_found');
  }
  return cert;
};

/**
 *
 * @param certBase64
 */
var getCertAsync = exports.getCertAsync = function getCertAsync(certBase64) {
  return window.cadesplugin.async_spawn( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var cert;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // eslint-disable-line func-names
            cert = null;
            _context2.prev = 1;
            _context2.next = 4;
            return window.cadesplugin.CreateObjectAsync('CAdESCOM.Certificate');

          case 4:
            cert = _context2.sent;
            _context2.next = 7;
            return cert.Import(certBase64);

          case 7:
            _context2.next = 9;
            return cert.FindPrivateKey();

          case 9:
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](1);

            console.info('Failed to create CAdESCOM.Certificate: ', errorMessage(_context2.t0)); // eslint-disable-line no-console
            throw new Error('sign.private_key_not_found');

          case 15:
            return _context2.abrupt('return', cert);

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 11]]);
  }));
};

/**
 * Данные для подлписи по документу
 *
 * @param {string} recordID
 * @param {string} base64 digest
 * @param {string} signer
 */
var signAsync = exports.signAsync = function signAsync(_ref2, signer) {
  var recordID = _ref2.recordID,
      digest = _ref2.digest;
  return window.cadesplugin.async_spawn( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var oSignedData, sSignedMessage;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return window.cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');

          case 3:
            oSignedData = _context3.sent;
            _context3.next = 6;
            return oSignedData.propset_ContentEncoding(window.cadesplugin.CADESCOM_BASE64_TO_BINARY);

          case 6:
            _context3.next = 8;
            return oSignedData.propset_Content(digest);

          case 8:
            _context3.next = 10;
            return oSignedData.SignCades(signer, window.cadesplugin.CADESCOM_CADES_BES, true);

          case 10:
            sSignedMessage = _context3.sent;

            console.log('%c  Подпись сформирована успешно!', 'background: #222; color: #bada55'); // eslint-disable-line no-console
            return _context3.abrupt('return', {
              recordID: recordID,
              sign: sSignedMessage
            });

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](0);

            console.info('Возникла ошибка:', _context3.t0.message); // eslint-disable-line no-console
            throw new Error('sign.private_key_not_found');

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 15]]);
  }));
};

/**
 *
 * Данные для подлписи по документу
 *
 * @param {string} recordID
 * @param {string} base64 digest
 * @param {string} signer
 * @returns {{sign: *}}
 */
var signSync = exports.signSync = function signSync(_ref3, signer) {
  var recordID = _ref3.recordID,
      digest = _ref3.digest;

  try {
    var oSignedData = window.cadesplugin.CreateObject('CAdESCOM.CadesSignedData');
    oSignedData.ContentEncoding = window.cadesplugin.CADESCOM_BASE64_TO_BINARY;
    oSignedData.Content = digest;
    var sSignedMessage = oSignedData.SignCades(signer, window.cadesplugin.CADESCOM_CADES_BES, true);
    console.debug('Подпись сформирована успешно!'); // eslint-disable-line no-console
    return {
      recordID: recordID,
      sign: sSignedMessage
    };
  } catch (err) {
    console.info('Возникла ошибка:', err.message); // eslint-disable-line no-console
    throw new Error('sign.private_key_not_found');
  }
};

/**
 *
 * @param cert
 * @returns {*}
 */
var signerSync = exports.signerSync = function signerSync(cert) {
  try {
    var oSigner = window.cadesplugin.CreateObject('CAdESCOM.CPSigner');
    oSigner.Certificate = cert;
    oSigner.Options = window.cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY;
    return oSigner;
  } catch (err) {
    console.info('Возникла ошибка:', err.message); // eslint-disable-line no-console
    throw new Error('sign.private_key_not_found');
  }
};

/**
 *
 * @param cert
 */
var signerAsync = exports.signerAsync = function signerAsync(cert) {
  return window.cadesplugin.async_spawn( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var oSigner;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return window.cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner');

          case 3:
            oSigner = _context4.sent;
            _context4.next = 6;
            return oSigner.propset_Certificate(cert);

          case 6:
            _context4.next = 8;
            return oSigner.propset_Options(window.cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY);

          case 8:
            return _context4.abrupt('return', oSigner);

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4['catch'](0);

            console.info('Возникла ошибка:', _context4.t0.message); // eslint-disable-line no-console
            throw new Error('sign.private_key_not_found');

          case 15:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 11]]);
  }));
};

/**
 *
 * @returns {{loaded: boolean, enabled: boolean, version: *}}
 */
function pluginInfoSync() {
  var result = {
    enabled: false,
    loaded: false,
    currentPluginVersion: null
  };
  try {
    var oAbout = window.cadesplugin.CreateObject('CAdESCOM.About');
    result.loaded = true;
    result.enabled = true;

    // Это значение будет проверяться сервером при загрузке демо-страницы
    result.currentPluginVersion = oAbout.PluginVersion;
    if (!result.currentPluginVersion) {
      result.currentPluginVersion = oAbout.Version;
    }
  } catch (err) {
    // Объект создать не удалось, проверим, установлен ли
    // вообще плагин. Такая возможность есть не во всех браузерах
    var mimetype = navigator.mimeTypes['application/x-cades'];
    if (mimetype) {
      result.loaded = true;
      result.enabled = !!mimetype.enabledPlugin;
    }
  }
  return {
    loaded: result.loaded,
    enabled: result.enabled,
    version: versionToString(result.currentPluginVersion, true)
  };
}

/**
 *
 */
var pluginInfoAsync = exports.pluginInfoAsync = function pluginInfoAsync() {
  return window.cadesplugin.async_spawn( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var oAbout, currentPluginVersion, pluginVersion;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return window.cadesplugin.CreateObjectAsync('CAdESCOM.About');

          case 2:
            oAbout = _context5.sent;
            _context5.next = 5;
            return oAbout.PluginVersion;

          case 5:
            currentPluginVersion = _context5.sent;
            _context5.next = 8;
            return versionToString(currentPluginVersion);

          case 8:
            pluginVersion = _context5.sent;
            return _context5.abrupt('return', {
              version: pluginVersion,
              enabled: true
            });

          case 10:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
};

/**
 *
 * @param e
 * @returns {*}
 */
function errorMessage(e) {
  var err = e.message;
  if (!err) {
    err = e;
  } else if (e.number) {
    err += '(0x' + (0, _utils.decimalToHexString)(e.number) + ')'; // eslint-disable-line no-undef
  }
  return err;
}

/**
 *
 * @param oVer
 * @param isSync
 * @returns {*}
 */
function versionToString(oVer, isSync) {
  // Promise< * > | string | null| TypeOver
  if (!oVer) return null;
  if (typeof oVer === 'string' && isSync) return oVer;

  var arrVersion = [oVer.MajorVersion, oVer.MinorVersion, oVer.BuildVersion];
  return new Promise(function (resolve) {
    Promise.all(arrVersion).then(function (versions) {
      return resolve(versions.join('.'));
    });
  });
}

/**
 *
 * @param branchName
 * @param cityName
 * @param fname
 * @returns {{fNameReplace, branchNameReplace, cityNameReplace}}
 */


function prepareStringForDistinguishedNameEncode(_ref4) {
  var branchName = _ref4.branchName,
      cityName = _ref4.cityName,
      name = _ref4.name;

  var req = /"/ig;
  var repl = '';
  return {
    fNameReplace: name.replace(req, repl),
    branchNameReplace: branchName.replace(req, repl),
    cityNameReplace: cityName.replace(req, repl)
  };
}

/**
 *
 * @param encodeData
 *  CN="Firstname Lastname";
 *  OU="Отделение Романов Двор";
 *  O="7743897707 (ИНН организации)";
 *  L="Moscow";
 *  C="RU";
 *  E="name@domain.com"
 *
 *  cryptoServiceConf - получаем по ручке 'defaultValues/certReq'
 *
 *  @link https://www.cryptopro.ru/forum2/default.aspx?g=posts&t=10133
 */
function createPKCS10SyncRequest(_ref8, cryptoServiceConf) {
  var _ref8$ulk = _ref8.ulk,
      branchName = _ref8$ulk.branchName,
      email = _ref8$ulk.email,
      cityName = _ref8$ulk.cityName,
      name = _ref8$ulk.name,
      orgINN = _ref8$ulk.orgINN;
  var exportableKey = cryptoServiceConf.keyGenConf.exportableKey,
      keyUsageOIDs = cryptoServiceConf.keyUsageOIDs;


  var keyUsageOIDsSplit = keyUsageOIDs.split(';');

  var _prepareStringForDist2 = prepareStringForDistinguishedNameEncode({ branchName: branchName, cityName: cityName, name: name }),
      fNameReplace = _prepareStringForDist2.fNameReplace,
      branchNameReplace = _prepareStringForDist2.branchNameReplace,
      cityNameReplace = _prepareStringForDist2.cityNameReplace;

  var PrivateKey = window.cadesplugin.CreateObject(_constants.CX509PrivateKey);
  var objRequest = window.cadesplugin.CreateObject(_constants.CX509CertificateRequestPkcs10);
  var objX509ExtensionEnhancedKeyUsage = window.cadesplugin.CreateObject(_constants.CX509ExtensionEnhancedKeyUsage);
  var DistinguishedName = window.cadesplugin.CreateObject(_constants.CX500DistinguishedName);
  var objObjectIds = window.cadesplugin.CreateObject(_constants.CObjectIds);
  var objObjectId = window.cadesplugin.CreateObject(_constants.CObjectId);
  var KeyUsageExtension = window.cadesplugin.CreateObject(_constants.CX509ExtensionKeyUsage);
  var objEnroll = window.cadesplugin.CreateObject(_constants.CX509Enrollment);

  PrivateKey.ProviderName = _constants.PROVIDER_NAME;
  PrivateKey.ProviderType = 75;
  PrivateKey.ExportPolicy = exportableKey === 'YES' ? 1 : 0x00000000;
  PrivateKey.KeyUsage = 2;
  PrivateKey.KeySpec = 1;
  objRequest.InitializeFromPrivateKey(0x1, PrivateKey, '');

  DistinguishedName.Encode('CN="' + fNameReplace + '";OU="' + branchNameReplace + '";O="' + orgINN + '";L="' + cityNameReplace + '";C="RU";E="' + email + '"');

  objRequest.Subject = DistinguishedName;

  keyUsageOIDsSplit.map(function (keyUsage) {
    return objObjectId.InitializeFromValue(keyUsage);
  });
  // objObjectId.InitializeFromValue(REGISTRATION_AUTHORITY_USER);
  objObjectIds.Add(objObjectId);
  objX509ExtensionEnhancedKeyUsage.InitializeEncode(objObjectIds);
  objRequest.X509Extensions.Add(objX509ExtensionEnhancedKeyUsage);

  KeyUsageExtension.InitializeEncode(_constants.CERT_KEY_ENCIPHERMENT_KEY_USAGE | _constants.CERT_DATA_ENCIPHERMENT_KEY_USAGE | _constants.CERT_DIGITAL_SIGNATURE_KEY_USAGE | _constants.CERT_NON_REPUDIATION_KEY_USAGE);
  objRequest.X509Extensions.Add(KeyUsageExtension);
  objEnroll.InitializeFromRequest(objRequest);
  var pkcs10 = objEnroll.CreateRequest(_constants.CREATE_REQUEST);

  return {
    pkcs10: pkcs10,
    containerName: PrivateKey.ContainerName
  };
}

/**
 * обертка над CryptoPro плагином с вызовом разных методов  SYNC и ASYNC
 */
var CryptoProService = {
  pluginInfo: function pluginInfo() {
    try {
      var result = isPluginAsync() ? pluginInfoAsync() : pluginInfoSync();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(Error('no plugin installed'));
    }
  },
  createDetachedSign: function createDetachedSign(doc, signer) {
    var result = isPluginAsync() ? signAsync(doc, signer) : Promise.resolve(signSync(doc, signer));

    return result.catch(function (err) {
      throw new Error(err.message);
    });
  },
  findCert: function findCert(certBase64) {
    return isPluginAsync() ? getCertAsync(certBase64) : Promise.resolve(getCertSync(certBase64));
  },
  signer: function signer(cert) {
    return isPluginAsync() ? signerAsync(cert) : Promise.resolve(signerSync(cert));
  },
  isOnToken: function isOnToken(cert) {
    return isPluginAsync() ? isOnTokenAsync(cert) : Promise.resolve(isOnTokenSync(cert));
  },
  createPKCS10Request: function createPKCS10Request(data, conf) {
    return isPluginAsync() ? createPKCS10AsyncRequest(data, conf) : Promise.resolve(createPKCS10SyncRequest(data, conf));
  },
  checkPluginWorking: function checkPluginWorking() {
    var loadPlugin = (0, _cadesplugin_api2.default)();
    return loadPlugin.checkPluginWorking();
  }
};

exports.default = CryptoProService;