import { all, put } from 'redux-saga/effects';
import { List, fromJS } from 'immutable';
import CryptoProService from '@rbo/crypto-pro-csp';
import { ACTIONS } from '../constants';
import { putCancelActionChannel } from './channels';
import {  
  signCreateAction,
  showSignModalAction,  
  clearSignDataAction
} from '../actions';

/**
 * вызов компонента sign
 * @param action
 */
export function* showSignModalSaga(action) {
  const { payload } = action;
  const cryptoProfiles = fromJS(payload);
  const cryptoProfilesSize = cryptoProfiles.getIn([0, 'cryptoProfiles'], List([])).size;
  const profile = cryptoProfiles.getIn([0, 'cryptoProfiles', 0]);
  const cryptoType = cryptoProfiles.getIn([0, 'cryptoProfiles', 0, 'cryptoType'], '');

  // поднимаем окно и полем ввода пароля из sms
  if (cryptoProfilesSize === 1 && cryptoType === 'sms') {
    yield all([
      put(showSignModalAction(true, cryptoType)),
      put(signCreateAction({
        cryptoProfileId: profile.get('cryptoProfileId')
      }, cryptoType))
    ]);

    // сразу начинаем работу с крипто-про
  } else if (cryptoProfilesSize === 1 && cryptoType !== 'sms') {
    try {
      const pluginInfo = yield CryptoProService.pluginInfo();
      if (pluginInfo && pluginInfo.enabled) {
        yield put(
          signCreateAction({
            cryptoProfileId: profile.get('cryptoProfileId')
          })
        );
      } else {
        yield put(showSignModalAction(true, 'cryptoPro', true));
      }
    } catch (error) {
      yield put(showSignModalAction(true, 'cryptoPro', true));
    }

    // если вариантов подписи больше чем 1
  } else if (cryptoProfilesSize > 1) {
    yield put(showSignModalAction(true));
  }
}

/**
 *
 */
export function* hideSignModal() {
  yield all([
    put({ type: ACTIONS.SIGN_MODAL_VISIBILITY, payload: { show: false, isNotPutCancelActionChannel: true } }),
    put(clearSignDataAction())
  ]);
}


export function* visibilityModalSaga(action) {
  const { payload: { show, isNotPutCancelActionChannel } } = action;
  if (!show && !isNotPutCancelActionChannel) {
    yield putCancelActionChannel();
  }
}
