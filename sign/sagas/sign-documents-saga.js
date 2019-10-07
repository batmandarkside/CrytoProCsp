import { put, call, select, all } from 'redux-saga/effects';
import { compact } from 'lodash';
import CryptoProService from '@rbo/crypto-pro-csp';
import { toggleGlobalLoaderAction } from 'application/actions';
import { addOrdinaryNotificationAction } from 'components/global/notifications/actions';
import { prepareConfForNotification } from 'utils/errors-util';
import { saveStatus as dalSaveStatus } from 'dal/signature/sagas';
import { ACTIONS } from '../constants';
import { statusesSign } from '../statuses';
import { 
  putFailActionChannel, 
  putSuccessActionChannel
} from './channels';

import {  
  saveRealitySignDocumentsAction,
  saveSignedDocumentsWithCryptoProAction,
  setSignStatusPendingAction
} from '../actions';

export const createSignResultSelector = state => state.getIn(['sign', 'createSignResult']);
export const smsCodeSelector = state => state.getIn(['sign', 'smsCode']);
export const channelSelector = state => state.getIn(['sign', 'channel']);


/**
 * Подписываем документ при помощи плагина Crypto и сервиса CryptoProService
 * для некоторых документов не приходит digest - Promise.resolve({ recordID: document, notDigest: true })
 * @param doc
 * @param signer
 */
export const signDoc = (doc, signer, document) => (
  doc
    ? CryptoProService.createDetachedSign(doc, signer)
    : Promise.resolve({ recordID: document, notDigest: true })
);


/**
 * попытка подписи документа на машине с помощью плагина cryptoPro
 * при выборе подписи по cryptoPro
 */
export function* signDocuments() {
  // объект digests для подписи
  const digestsSign = yield select(createSignResultSelector);
  const { docIds, digests, cert } = digestsSign.toJS();

  try {
    yield put(toggleGlobalLoaderAction(true));
    // информация по плагину
    yield CryptoProService.pluginInfo();

    // поиск сертификата
    const foundCert = yield CryptoProService.findCert(cert.content);
    yield CryptoProService.isOnToken(foundCert);
    const signer = yield CryptoProService.signer(foundCert);

    // групповая подпись
    const signedCollection = yield all(docIds.map(document =>
      call(signDoc, digests.find(d => d.recordID === document), signer, document)
    ));

    const signedCollectionResolved = yield all(compact(signedCollection)
      .map(({ recordID, sign, notDigest }) =>
        ({ docId: recordID, sign, notDigest })
      )
    );

    const compileForSign = signedCollectionResolved.filter(d => !d.notDigest);
    const compileNotSign = signedCollectionResolved.filter(d => d.notDigest);

    // сохраняем подписанные и не подписанные документы
    yield put(saveSignedDocumentsWithCryptoProAction(compileForSign, compileNotSign));

    // отправка подписи на сервер
    const resultSaveData = yield call(saveSignStatusSaga, compileForSign);
    if (resultSaveData && resultSaveData.length) {
      yield all([
        put(toggleGlobalLoaderAction(false)),
        put(setSignStatusPendingAction(false)),
        putSuccessActionChannel(resultSaveData),
        put({
          type: ACTIONS.SIGN_DOCUMENT_SEND_SUCCESS,
          payload: {
            resultSaveData
          }
        })
      ]);
    }
  } catch (error) {
    yield all([
      put(toggleGlobalLoaderAction(false)),
      put(setSignStatusPendingAction(false)),
      putFailActionChannel(error),
      put(addOrdinaryNotificationAction(prepareConfForNotification(error)))
    ]);
  }
}


/**
 * подпись по sms
 */
export function* signSmsDocuments() {
  // объект digests для подписи
  const digestsSign = yield select(createSignResultSelector);
  const smsCode = yield select(smsCodeSelector);
  const { doc } = digestsSign.toJS();

  try {
    const resultSaveData = yield call(saveSignStatusSaga, [{ docId: doc, sign: smsCode }]);
    if (resultSaveData && resultSaveData.length) {
      yield all([
        put({
          type: ACTIONS.SIGN_SMS_DOCUMENT_SUCCESS,
          payload: {
            resultSaveData
          }
        }),
        putSuccessActionChannel(resultSaveData)
      ]);
    }
  } catch (error) {
    yield all([
      put({ type: ACTIONS.SIGN_SMS_DOCUMENT_FAIL, error: prepareConfForNotification(error) }),
      put(setSignStatusPendingAction(false)),
      put(addOrdinaryNotificationAction(prepareConfForNotification(error)))
    ]);
  }
}


/**
 * отправляем подписанный документ
 * @param collectionForSign
 * @param onToken
 */
export function* saveSignStatusSaga(collectionForSign, onToken = false) {
  try {
    const result = yield call(dalSaveStatus, { payload: {
      signs: collectionForSign,
      onToken
    } });

    if (result && result.length) {
      const realitySign = result.filter(s => statusesSign.includes(s.status));
      yield put(saveRealitySignDocumentsAction(realitySign));
    }
    return result;
  } catch (error) {
    throw error;
  }
}
