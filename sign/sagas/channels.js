import { put, select } from 'redux-saga/effects';

export const channelSelector = state => state.getIn(['sign', 'channel']);

/**
 *
 * @param resultData
 */
export function* putSuccessActionChannel(resultData) {
  const CHANNEL = yield select(channelSelector);
  if (CHANNEL.get('success')) {
    yield put({
      type: CHANNEL.get('success'),
      payload: {
        resultData
      }
    });
  }
}

export function* putCancelActionChannel() {
  const CHANNEL = yield select(channelSelector);
  if (CHANNEL.get('cancel')) {
    yield put({ type: CHANNEL.get('cancel') });
  }
}

/**
 *
 * @param error
 */
export function* putFailActionChannel(error) {
  const CHANNEL = yield select(channelSelector);
  if (CHANNEL.get('fail')) {
    yield put({ type: CHANNEL.get('fail'), error });
  }
}
