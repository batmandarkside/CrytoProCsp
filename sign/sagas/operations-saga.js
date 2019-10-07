import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  printCert as dalPrintCert,
  downloadCert as dalDownloadCert,
  removeCert as dalRemoveCert
} from 'dal/signature/sagas';
import { ACTIONS } from '../constants';
import {
  signDocAdd,  
  getCryptoProfilesAction  
} from '../actions';

/**
 * добавляем в reducer id документа на подпись
 * так же сохраняем уникальный id канала в котором работает подпись - actionChannelName
 * и вызываем компонент подписи
 * @param action
 */
export function* addDocForSignSaga(action) {
  const { payload: { docIds, visa, channel } } = action;
  // сограняем в reducer
  yield put(signDocAdd(docIds, visa));

  // задержка для теста
  yield call(delay, 0);

  if (channel) {
    yield put({
      type: ACTIONS.SIGN_SAVE_CHANNEL,
      payload: {
        channel
      }
    });
  }

  // получение КриптоПрофайлов для выбора способа подписи
  yield put(getCryptoProfilesAction(false));
}

/**
 * 
 * @param {docId} param
 */
export function* printCertSaga({ docId }) {  
  try {
    const result = yield call(dalPrintCert, { payload: { docId } });
    yield put({
      type: ACTIONS.SIGN_CRYPTO_OPERATION_PRINT_SUCCESS,
      payload: docId
    });
    return result;
  } catch (error) {
    yield put({ type: ACTIONS.SIGN_CRYPTO_OPERATION_PRINT_FAIL, error: error.message });
    throw error;
  }
}

export function* downloadActiveCertSaga({ certId }) {
  try {
    const result = yield call(dalDownloadCert, { payload: { certId } });
    yield put({
      type: ACTIONS.SIGN_CRYPTO_OPERATION_DOWNLOAD_ACTIVE_CERT_SUCCESS,
      payload: certId
    });
    return result;
  } catch (error) {
    yield put({ type: ACTIONS.SIGN_CRYPTO_OPERATION_DOWNLOAD_ACTIVE_CERT_FAIL, error: error.message });
    throw error;
  }
}

/**
 *
 * @param payload
 */
export function* deleteCertSaga({ payload }) {
  const { id, requestType } = payload;
  try {
    const result = yield call(dalRemoveCert, { payload: {
      docId: id,
      reqType: requestType === 'new' ? 'CryptoProReqNew' : 'CryptoProReqRegen'
    } });
    yield put({
      type: ACTIONS.SIGN_CRYPTO_OPERATION_DELETE_SUCCESS,
      payload: id
    });
    return result;
  } catch (error) {    
    yield put({ type: ACTIONS.SIGN_CRYPTO_OPERATION_DELETE_FAIL, error: error.message });
    throw error;
  }
}
