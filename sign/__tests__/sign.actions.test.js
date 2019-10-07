/* eslint-disable no-unused-vars */
import chai, { expect }   from 'chai';
import chaiImmutable      from 'chai-immutable';
import { ACTIONS }        from '../constants';

import {
  showSignModalAction,
  showInfoPluginAction,
  getCryptoProfilesAction,
  signCreateAction,
  signSmsDocumentAction,
  signDocAddAndTrySigningAction,
  signDocAdd
}   from '../actions';

chai.use(chaiImmutable);

describe('Sign reducer tests', () => {
  it('test actions', () => {
    expect(ACTIONS.SIGN_MODAL_VISIBILITY).to.exist;
    expect(ACTIONS.SIGN_SHOW_INFO_PLUGIN).to.exist;
    expect(ACTIONS.SIGN_DOC_ADD).to.exist;
    expect(ACTIONS.SIGN_DOC_ADD_AND_TRY_SIGNING).to.exist;
    expect(ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_REQUEST).to.exist;
    expect(ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_SUCCESS).to.exist;
    expect(ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_FAIL).to.exist;
    expect(ACTIONS.SIGN_CREATE_REQUEST).to.exist;
    expect(ACTIONS.SIGN_CREATE_SUCCESS).to.exist;
    expect(ACTIONS.SIGN_CREATE_FAIL).to.exist;
    expect(ACTIONS.SIGN_PREPARE).to.exist;
    expect(ACTIONS.SIGN_DELETE).to.exist;

    expect(ACTIONS.SIGN_DOCUMENT_REQUEST).to.exist;
    expect(ACTIONS.SIGN_DOCUMENT_SUCCESS).to.exist;
    expect(ACTIONS.SIGN_SMS_DOCUMENT_REQUEST).to.exist;
    expect(ACTIONS.SIGN_SMS_DOCUMENT_SUCCESS).to.exist;
    expect(ACTIONS.SIGN_SMS_DOCUMENT_FAIL).to.exist;

    expect(ACTIONS.SIGN_DOCUMENT_SEND_SUCCESS).to.exist;

    expect(showSignModalAction).to.be.a('function');
    expect(showInfoPluginAction).to.be.a('function');
    expect(getCryptoProfilesAction).to.be.a('function');
    expect(getCryptoProfilesAction).to.be.a('function');
    expect(signSmsDocumentAction).to.be.a('function');
    expect(signCreateAction).to.be.a('function');
    expect(signDocAddAndTrySigningAction).to.be.a('function');
    expect(signDocAdd).to.be.a('function');
  });
});
