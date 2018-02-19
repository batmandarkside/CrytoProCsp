import { expect } from 'chai';
import cryptoProPlugin from '../cadesplugin_api';
import CryptoProService, { isPluginAsync } from '../cryptopro_csp';

navigator.mimeTypes = {};
navigator.mimeTypes['application/x-cades'] = null;

describe('Test CryptoProService', () => {
  const loadPlugin = cryptoProPlugin();
  loadPlugin.checkPluginWorking();

  it('test isPluginAsync', () => {
    expect(isPluginAsync()).to.be.false;
  });

  it('test CryptoProService.pluginInfo', done => {
    CryptoProService.pluginInfo().then(info => {
      expect(info.enabled).to.be.false;
      done();
    }).catch(() => {
      done();
    });
  });

  it('test CryptoProService.findCert', done => {
    try {
      CryptoProService.findCert('qi3485ytgsjtdkfjy6qtwjrgfasjhdgf').then(() => {
        done();
      });
    } catch (error) {
      expect(error.message).eql('sign.private_key_not_found');
      done();
    }
  });

  it('test CryptoProService.signer', done => {
    try {
      CryptoProService.signer('qi3485ytgsjtdkfjy6qtwjrgfasjhdgf').then(oSigner => {
        expect(oSigner.Options).eql(2);
        done();
      });
    } catch (error) {
      expect(error.message).eql('sign.private_key_not_found');
      done();
    }
  });

  it('test CryptoProService.isOnToken', done => {
    const cert = {
      PrivateKey: {
        UniqueContainerName: 'REGISTRY_q832746uyasdftg'
      }
    };

    CryptoProService.isOnToken(cert).then(token => {
      expect(token).to.be.false;
      done();
    });
  });
});