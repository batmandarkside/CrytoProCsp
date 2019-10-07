import { call } from 'redux-saga/effects';
import CryptoProService from '@rbo/crypto-pro-csp';
import {
  initCert as dalInitCert,
  sendToBank as dalSendToBank
} from 'dal/signature/sagas';

// Перевыпуск и подпись сертификата
// Для подписи документов есть сага - createSignSaga

/**
 * @param doc
 * @param signer
 */
export const signDoc = (doc, signer) => (
  CryptoProService.createDetachedSign(doc, signer)
);

export function* signCertSaga(action) {
  const { payload: { docId, signAuthId } } = action;
  try {
    const digestData = yield call(dalInitCert, { payload: {
      docId,
      signAuthId
    } });
    if (!digestData.digests ||  !digestData.digests.length) {
      throw new Error('Ошибка при получении digests документа');
    }
    const { digests, cert } = digestData;
    // информация по плагину
    yield CryptoProService.pluginInfo();
    // поиск сертификата
    const foundCert = yield CryptoProService.findCert(cert.content);
    yield CryptoProService.isOnToken(foundCert);
    const signer = yield CryptoProService.signer(foundCert);
    const signDocResult = yield call(signDoc, digests[0], signer);

    return yield call(dalSendToBank, { payload: {
      docId,
      sign: signDocResult.sign,
      onToken: false
    } });
  } catch (error) {
    throw error;
  }
}

