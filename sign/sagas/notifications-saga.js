import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { filterPlural } from 'app/utils';
import CryptoProService from '@rbo/crypto-pro-csp';
import { addOrdinaryNotificationAction } from 'components/global/notifications/actions';
import { prepareConfForNotification } from 'utils/errors-util';

/**
 * показать сообшение если плагин не установлен
 */
export function* showInfoPluginSaga() {
  yield call(delay, 5000);
  try {
    yield CryptoProService.pluginInfo();
  } catch (error) {
    // приводим объект ошибки к одному типу с сервером
    yield put(
      addOrdinaryNotificationAction(
        prepareConfForNotification({
          response: {
            data: { error: 'sign.plugin_not_installed' }
          }
        })
      )
    );
  }
}


/**
 *
 * @param docSize
 * @param signedDocSize
 * @param notSinedDocSize
 * @param countAmount
 */
export function* warningSignDocSaga(docSize, signedDocSize, notSinedDocSize, countAmount) {
  const collectionMessages = [
    {
      text: `Всего на подпись: ${docSize} ${filterPlural(['документ', 'документа', 'документов'], (docSize))}`
    }, {
      text: `Подписано: ${signedDocSize} ${filterPlural(['документ', 'документа', 'документов'], signedDocSize)}`
    }, {
      text: `Не подписано: ${notSinedDocSize} ${filterPlural(['документ', 'документа', 'документов'], notSinedDocSize)}`
    }, {
      text: countAmount ? `На сумму: ${countAmount}` : ''
    }
  ];
  const conf = {
    level: 'warning',
    type: 'messagesList',
    title: 'Результаты подписи',
    collectionMessages
  };
  yield put(addOrdinaryNotificationAction(conf));
}


/**
 *
 * @param docSize
 * @param signedDocSize
 * @param countAmount
 */
export function* successSignDocSaga(docSize, signedDocSize, countAmount) {
  const collectionMessages = [{
    text: `Всего на подпись: ${docSize} ${filterPlural(['документ', 'документа', 'документов'], docSize)}`
  }, {
    text: `Подписано: ${signedDocSize} ${filterPlural(['документ', 'документа', 'документов'], signedDocSize)}`
  }, {
    text: countAmount ? `На сумму: ${countAmount}` : ''
  }];
  const conf = {
    level: 'success',
    type: 'messagesList',
    title: 'Результаты подписи',
    collectionMessages
  };
  yield put(addOrdinaryNotificationAction(conf));
}
