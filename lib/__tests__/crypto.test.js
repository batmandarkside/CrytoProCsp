'use strict';

var _chai = require('chai');

var _cadesplugin_api = require('../cadesplugin_api');

var _cadesplugin_api2 = _interopRequireDefault(_cadesplugin_api);

var _cryptopro_csp = require('../cryptopro_csp');

var _cryptopro_csp2 = _interopRequireDefault(_cryptopro_csp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

navigator.mimeTypes = {};
navigator.mimeTypes['application/x-cades'] = null;

describe('Test CryptoProService', function () {
  var loadPlugin = (0, _cadesplugin_api2.default)();
  loadPlugin.checkPluginWorking();

  it('test isPluginAsync', function () {
    (0, _chai.expect)((0, _cryptopro_csp.isPluginAsync)()).to.be.false;
  });

  it('test CryptoProService.pluginInfo', function (done) {
    _cryptopro_csp2.default.pluginInfo().then(function (info) {
      (0, _chai.expect)(info.enabled).to.be.false;
      done();
    }).catch(function () {
      done();
    });
  });

  it('test CryptoProService.findCert', function (done) {
    try {
      _cryptopro_csp2.default.findCert('qi3485ytgsjtdkfjy6qtwjrgfasjhdgf').then(function () {
        done();
      });
    } catch (error) {
      (0, _chai.expect)(error.message).eql('sign.private_key_not_found');
      done();
    }
  });

  it('test CryptoProService.signer', function (done) {
    try {
      _cryptopro_csp2.default.signer('qi3485ytgsjtdkfjy6qtwjrgfasjhdgf').then(function (oSigner) {
        (0, _chai.expect)(oSigner.Options).eql(2);
        done();
      });
    } catch (error) {
      (0, _chai.expect)(error.message).eql('sign.private_key_not_found');
      done();
    }
  });

  it('test CryptoProService.isOnToken', function (done) {
    var cert = {
      PrivateKey: {
        UniqueContainerName: 'REGISTRY_q832746uyasdftg'
      }
    };

    _cryptopro_csp2.default.isOnToken(cert).then(function (token) {
      (0, _chai.expect)(token).to.be.false;
      done();
    });
  });
});