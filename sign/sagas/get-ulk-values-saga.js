import { put, call } from 'redux-saga/effects';
import { getUlkValues as dalGetUlkValues } from 'dal/signature/sagas';
import { ACTIONS } from '../constants';

/**
 * 
 * @param {*} param0 
 */
export function* getUlkValuesForRegenerateCertSaga({ cert }) {
  try {
    const data = yield call(dalGetUlkValues, { payload: {
      certId: cert.getIn(['cert', 'id'], ''),
      ulkId: cert.getIn(['ulk', 'id'], '')
    } });

    yield put({
      type: ACTIONS.SIGN_CRYPTOPRO_GET_ULK_FOR_REGENERATE_SUCCESS,
      payload: data
    });

    return data;
  } catch (error) {
    yield put({ type: ACTIONS.SIGN_CRYPTOPRO_GET_ULK_FOR_REGENERATE_FAIL });
    throw error;
  }
}
