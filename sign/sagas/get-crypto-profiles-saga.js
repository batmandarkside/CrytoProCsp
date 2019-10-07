import { all, put, call, select } from 'redux-saga/effects';
import { List } from 'immutable';
import {
  addOrdinaryNotificationAction
}  from 'components/global/notifications/actions';
import { getProfiles as dalGetCryptoProfiles } from 'dal/signature/sagas';
import { prepareConfForNotification } from 'utils/errors-util';
import { ACTIONS } from '../constants';
import { putFailActionChannel } from './channels';


export const saveDocIdForFutureSignSelector = state => ({
  docIdsCollection: state.getIn(['sign', 'saveDocIdForFutureSign'], List([])).toJS(),
  forVisa: state.getIn(['sign', 'saveDocVisa', 'visa'], false)
});

/**
 * @todo возможно требует доработки
 * @todo забирать документы готовые на подпись по select из какого то reducer
 *
 * метод getCryptoProfiles возвращает properties -> digest
 * это те данные из которых мы сформируем подпись
 *
 *
 {
    "Name": "24142241421",
    "Position": "Верховный Главнокомандующий",
    "ClientName": "Бирюков Андрей",
    "cryptoProfileId": "3cc24359-d2f6-427c-883f-6245c6b95be1",
    "Type": "Единственная подпись"
  }

 * docIds может быть только списком
 * делаем проверку на массив -> isArray(docIds) ? docIds : [docIds];
 *
 * @param action
 */
export function* getCryptoProfilesSaga() {
  // берем id документов готовых для подписи
  const { docIdsCollection, forVisa } = yield select(saveDocIdForFutureSignSelector);

  try {
    const data = yield call(dalGetCryptoProfiles, { payload: {
      docIds: docIdsCollection,
      forVisa
    } });

    yield put({
      type: ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_SUCCESS,
      payload: data
    });
  } catch (error) {
    yield all([
      put({ type: ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_FAIL, error }),
      put({ type: ACTIONS.SIGN_DOCUMENT_SEND_FAIL }),
      putFailActionChannel(error),
      put(addOrdinaryNotificationAction(prepareConfForNotification(error))),
    ]);
  }
}
