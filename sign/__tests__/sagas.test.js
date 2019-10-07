import { call, put, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { hideSignModal } from '../sagas/show-modal-saga';
import { addDocForSignSaga } from '../sagas/operations-saga';

import {
  getCryptoProfilesAction,
  signDocAddAndTrySigningAction,
  signDocAdd,
  clearSignDataAction
} from '../actions';

import { ACTIONS } from '../constants';

describe('Test Sign Sagas', () => {
  describe('addDocForSignSaga', () => {
    it('success', () => {
      const id = 'sdjfhsjhrdtsghdfg345345';
      const generator = addDocForSignSaga(signDocAddAndTrySigningAction({
        docIds: [id],
        visa: false
      }));

      expect(
        generator.next().value
      ).toEqual(
        put(signDocAdd([id], false))
      );

      expect(
        generator.next().value
      ).toEqual(
        call(delay, 0)
      );

      expect(
        generator.next().value
      ).toEqual(
        put(getCryptoProfilesAction(false))
      );
    });
  });

  describe('hideSignModal', () => {
    it('success', () => {
      const generator = hideSignModal();

      expect(
        generator.next().value
      ).toEqual(
        all([
          put({ type: ACTIONS.SIGN_MODAL_VISIBILITY, payload: { show: false, isNotPutCancelActionChannel: true } }),
          put(clearSignDataAction())
        ])
      );
    });
  });
});
