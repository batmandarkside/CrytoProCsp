import { all, put, call, select } from 'redux-saga/effects';
import { List } from 'immutable';
import { APP_VERSION } from 'constants';
import { addOrdinaryNotificationAction } from 'components/global/notifications/actions';
import { certsCreateAction } from 'app/application/actions';
import { init as dalSignatureInit } from 'dal/signature/sagas';
import { prepareConfForNotification }  from 'utils/errors-util';
import { ACTIONS } from '../constants';
import { putFailActionChannel } from './channels';
import { warningSignDocSaga } from './notifications-saga';
import { signDocuments } from './sign-documents-saga';
import {
  saveTypeSignAction,
  setSignStatusPendingAction
} from '../actions';

const applicationVersionSelector = state => state.getIn(['application', 'version']);

export const saveDocIdForFutureSignSelector = state => ({
  docIdsCollection: state.getIn(['sign', 'saveDocIdForFutureSign'], List([])).toJS(),
  forVisa: state.getIn(['sign', 'saveDocVisa', 'visa'], false)
});

/**
 * получение от сервера объекта digests по номеру документа
 * @param action
 */
export function* createSignSaga(action) {
  const {
    payload: {
      cryptoProfileId,
      type
    }
  } = action;

  // берем id документов готовых для подписи
  const { docIdsCollection, forVisa } = yield select(saveDocIdForFutureSignSelector);
  yield saveTypeSignAction(type);
  yield put(setSignStatusPendingAction(true));

  try {
    const resultSign = yield call(dalSignatureInit, { payload: {
      docIds: docIdsCollection,
      cryptoProfileId,
      forVisa
    } });

    /**
     * условие для групповой подписи
     * метод cryptoProfiles_v2 работает не корректно и возвращает пустой массив
     * вариантов подписи
     */
    if (!resultSign.digests || !resultSign.digests.length) {
      if (docIdsCollection.length > 1) {
        yield warningSignDocSaga(
          docIdsCollection.length,
          resultSign.digests.length,
          docIdsCollection.length
        );
        throw new Error('sign.wrong_rights');
      }
    }

    if (type === 'sms') {
      const passwordLifetime = parseInt(resultSign.digests[0].time, 10);
      const digest = decodeURIComponent(escape(window.atob(resultSign.digests[0].digest)));
      yield put({
        type: ACTIONS.SIGN_CREATE_SUCCESS, // событие для reducer
        payload: {
          digest,
          doc: docIdsCollection[0],
          data: passwordLifetime
        }
      });
    } else {
      // сохраняем в state
      yield put({
        type: ACTIONS.SIGN_CREATE_SUCCESS, // событие для reducer
        payload: {
          docIds: docIdsCollection,
          ...resultSign
        }
      });

      // попытка подписи cryptoPro
      yield* signDocuments();
    }
  } catch (error) {
    const notify = prepareConfForNotification(error);
    const { typeError } = notify;

    yield all([
      put({ type: ACTIONS.SIGN_CREATE_FAIL, error: notify }),
      put({ type: ACTIONS.SIGN_DOCUMENT_SEND_FAIL, error: notify }),
      putFailActionChannel(error),
      put(setSignStatusPendingAction(false))
    ]);

    if (typeError !== 'cert.active_cert_not_found') {
      yield put(addOrdinaryNotificationAction(notify));
    } else {
      // отображаем кнопку "Создать" только в версии про
      const version = yield select(applicationVersionSelector);
      if (version === APP_VERSION.PRO) {
        yield put(addOrdinaryNotificationAction({
          type: 'alert',
          level: 'warning',
          message: 'У вас нет ни одного активного сертификата',
          success: { label: 'Создать', action: certsCreateAction() }
        }));
      }
      if (version === APP_VERSION.LITE) {
        yield put(addOrdinaryNotificationAction({
          level: 'warning',
          message: 'У вас нет ни одного активного сертификата'
        }));
      }
    }
  }
}
