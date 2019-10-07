import { ACTIONS } from './constants';

/**
 *
 * @param isShow
 * @param cryptoType
 * @param showInstructionInstall - сразу показываем инструкцию по установке плагина
 */
export const showSignModalAction = (isShow, cryptoType = 'cryptoPro', showInstructionInstall = false) => ({
  type: ACTIONS.SIGN_MODAL_VISIBILITY,
  payload: {
    show: isShow,
    cryptoType,
    showInstructionInstall
  }
});

export const showInfoPluginAction = () => ({
  type: ACTIONS.SIGN_SHOW_INFO_PLUGIN
});

export const saveTypeSignAction = signType => ({
  type: ACTIONS.SIGN_SAVE_TYPE_SIGN,
  payload: {
    signType
  }
});

/**
 * основной action для запуска подписи
 * поднимает модальное окно и запрашивает варианты подписи для документа
 * @param docIds
 * @param visa
 */
export const signDocAddAndTrySigningAction = ({ docIds, visa = false, channel }) => ({
  type: ACTIONS.SIGN_DOC_ADD_AND_TRY_SIGNING,
  payload: {
    docIds,
    visa,
    channel
  }
});

/**
 * варианты подписи документа
 * docId, forVisa - забираем из store
 */
export const getCryptoProfilesAction = () => ({
  type: ACTIONS.SIGN_CRYPTO_PROFILES_LOAD_REQUEST
});

export const signCreateAction = ({ cryptoProfileId }, type = 'cryptoPro') => ({
  type: ACTIONS.SIGN_CREATE_REQUEST,
  payload: {
    cryptoProfileId,
    type
  }
});

export const setSignStatusPendingAction = isPending => ({
  type: ACTIONS.SIGN_SET_STATUS_PENDING,
  payload: {
    isPending
  }
});

/**
 *
 * @param type
 */
export const signSmsDocumentAction = (type = 'sms') => ({
  type: ACTIONS.SIGN_SMS_DOCUMENT_REQUEST,
  payload: {
    type
  }
});

/**
 * сохраняем подписанные и не подписанные документы
 * @param compileForSign
 * @param compileNotSign
 */
export const saveSignedDocumentsWithCryptoProAction = (compileForSign, compileNotSign) => ({
  type: ACTIONS.SIGN_SAVE_SIGNED_DOCUMENTS,
  payload: {
    compileForSign,
    compileNotSign
  }
});

/**
 * реально подписанные документы ( после отправки на сервер )
 * @param documents
 */
export const saveRealitySignDocumentsAction = documents => ({
  type: ACTIONS.SIGN_SAVE_REALITY_SIGN_DOCUMENTS,
  payload: {
    documents
  }
});


export const signDocAdd = (docIds, visa) => ({
  type: ACTIONS.SIGN_DOC_ADD,
  payload: {
    docIds,
    visa
  }
});

export const signSetSmsCodeAction = code => ({
  type: ACTIONS.SIGN_SET_SMS_CODE,
  payload: {
    code
  }
});

export const signRegenSmsCodeAction = () => ({
  type: ACTIONS.SIGN_REGEN_SMS_CODE
});

export const clearSignDataAction = () => ({
  type: ACTIONS.SIGN_CLEAR_DATA
});
