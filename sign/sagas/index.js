import { takeLatest } from 'redux-saga/effects';
import { ACTIONS } from '../constants';
import { showInfoPluginSaga } from './notifications-saga';
import { addDocForSignSaga } from './operations-saga';
import { getCryptoProfilesSaga } from './get-crypto-profiles-saga';
import { showSignModalSaga, visibilityModalSaga, hideSignModal } from './show-modal-saga';
import { createSignSaga } from './create-sign-saga';
import { signDocuments, signSmsDocuments } from './sign-documents-saga';

/**
 * Combine Sagas
 */
export default function* signSaga() {
  yield takeLatest(ACTIONS.SIGN_SHOW_INFO_PLUGIN, showInfoPluginSaga);
  yield takeLatest(ACTIONS.SIGN_DOC_ADD_AND_TRY_SIGNING, addDocForSignSaga);

  // список вариантов подписи
  yield takeLatest(ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_REQUEST, getCryptoProfilesSaga);
  yield takeLatest(ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_SUCCESS, showSignModalSaga);

  yield takeLatest(ACTIONS.SIGN_CREATE_REQUEST, createSignSaga);
  yield takeLatest(ACTIONS.SIGN_MODAL_VISIBILITY, visibilityModalSaga);

  yield takeLatest(ACTIONS.SIGN_DOCUMENT_REQUEST, signDocuments);
  yield takeLatest(ACTIONS.SIGN_SMS_DOCUMENT_REQUEST, signSmsDocuments);

  yield takeLatest(ACTIONS.SIGN_DOCUMENT_SEND_SUCCESS, hideSignModal);
  yield takeLatest(ACTIONS.SIGN_SMS_DOCUMENT_SUCCESS, hideSignModal);

  yield takeLatest(ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_FAIL, hideSignModal);
  yield takeLatest(ACTIONS.SIGN_CREATE_FAIL, hideSignModal);
}
