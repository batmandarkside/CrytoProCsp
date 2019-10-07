import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

/**
 * Сохраняем документ или группу документов для дальнейшей подписи
 * дублируем для visa в объект saveDocVisa
 * @param state
 * @param payload
 */
export const saveDocForSign = (state, payload) => (
  state
    .set('saveDocIdForFutureSign', fromJS(payload.docIds || []))
    .setIn(['saveDocVisa', 'docIds'], fromJS(payload.docIds))
    .setIn(['saveDocVisa', 'visa'], payload.visa)
);

export const clearData = state =>
  state.merge({
    error: {
      message: ''
    },
    smsCode: '',
    signPending: false,
    choosenCryptoProfileId: '',
    choosenSignType: ''
  });

export const defaultState = fromJS({
  saveDocIdForFutureSign: [],
  saveDocVisa: {
    docIds: [],
    visa: ''
  },
  saveAfterTrySignGroupDocuments: {
    compileForSign: [],
    compileNotSign: []
  },
  saveRealitySignGroupDocuments: [],

  //  уникальные TYPE канала на который потом подписывается породивший этот канал
  channel: {
    success: '',
    cancel: '',
    fail: ''
  },
  cryptoProfilesLoader: false,
  documents: [],
  createSignLoader: false,
  showSignModal: false,
  signPending: false,
  showInstructionInstall: false,
  createSignResult: {},
  choosenCryptoProfileId: '',
  choosenSignType: '',
  cryptoType: '',
  smsCode: '',
  loaderSignSms: false,
  error: {
    message: ''
  }
});

const sign = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.SIGN_MODAL_VISIBILITY:
      return state
        .set('showSignModal', action.payload.show)
        .set('cryptoType', action.payload.cryptoType)
        .set('showInstructionInstall', action.payload.showInstructionInstall);

    case ACTIONS.SIGN_DOC_ADD:
      return saveDocForSign(state, action.payload);
    case ACTIONS.SIGN_SMS_DOCUMENT_REQUEST:
      return state
        .set('loaderSignSms', true)
        .set('signType', 'sms');
    case ACTIONS.SIGN_SMS_DOCUMENT_SUCCESS:
      return state.set('loaderSignSms', false);
    case ACTIONS.SIGN_SMS_DOCUMENT_FAIL:
      return state
        .set('error', fromJS(action.error))
        .set('loaderSignSms', false);

    // тип подписи
    case ACTIONS.SIGN_SAVE_TYPE_SIGN:
      return state.set('signType', action.payload.signType);
    case ACTIONS.SIGN_DOCUMENT_REQUEST:
      return state.set('signType', 'cryptoPro');
    // \\ тип подписи

    case ACTIONS.SIGN_SET_STATUS_PENDING:
      return state.set('signPending', action.payload.isPending);

    case ACTIONS.SIGN_CREATE_REQUEST:
      return state
        .set('createSignLoader', true)
        .set('choosenSignType', action.payload.type)
        .set('choosenCryptoProfileId', action.payload.cryptoProfileId);

    case ACTIONS.SIGN_CREATE_FAIL:
      return state.set('createSignLoader', false);
    case ACTIONS.SIGN_CREATE_SUCCESS:
      return state
        .set('createSignResult', fromJS(action.payload))
        .set('createSignLoader', false);

    case ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_REQUEST:
      return state.set('cryptoProfilesLoader', true);
    case ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_SUCCESS:
      return state
        .set('documents', fromJS(action.payload))
        .set('cryptoProfilesLoader', false);
    case ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_FAIL:
      return state.set('cryptoProfilesLoader', false);

    case ACTIONS.SIGN_SET_SMS_CODE:
      return state.set('smsCode', action.payload.code);
    case ACTIONS.SIGN_REGEN_SMS_CODE:
      return state.set('smsCode', '');

    case ACTIONS.SIGN_SAVE_SIGNED_DOCUMENTS:
      return state
        .setIn(['saveAfterTrySignGroupDocuments', 'compileForSign'], fromJS(action.payload.compileForSign))
        .setIn(['saveAfterTrySignGroupDocuments', 'compileNotSign'], fromJS(action.payload.compileNotSign));

    case ACTIONS.SIGN_SAVE_REALITY_SIGN_DOCUMENTS:
      return state.set('saveRealitySignGroupDocuments', fromJS(action.payload.documents));

    case ACTIONS.SIGN_SAVE_CHANNEL:
      return state.set('channel', fromJS(action.payload.channel));

    case ACTIONS.SIGN_CLEAR_DATA:
      return clearData(state);

    default:
      return state;
  }
};

export default sign;
