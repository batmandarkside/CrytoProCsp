const cryptoProfilesLoaderSelector = state => state.getIn(['sign', 'cryptoProfilesLoader']);
const createSignLoaderSelector = state => state.getIn(['sign', 'createSignLoader']);
const saveDocIdForFutureSignSelector = state => state.getIn(['sign', 'saveDocIdForFutureSign']);
const createSignResultSelector = state => state.getIn(['sign', 'createSignResult']);
const errorSelector = state => state.getIn(['sign', 'error']);
const documentsSelector = state => state.getIn(['sign', 'documents']);
const cryptoTypeSelector = state => state.getIn(['sign', 'cryptoType']);
const signPendingSelector = state => state.getIn(['sign', 'signPending']);
const showInstructionInstallSelector = state => state.getIn(['sign', 'showInstructionInstall']);

export const mapStateToProps = state => ({
  cryptoProfilesLoader: cryptoProfilesLoaderSelector(state),
  createSignLoader: createSignLoaderSelector(state),
  saveDocIdForFutureSign: saveDocIdForFutureSignSelector(state),
  createSignResult: createSignResultSelector(state),
  showSignModal: state.getIn(['sign', 'showSignModal']),
  docId: saveDocIdForFutureSignSelector(state),
  cryptoProfileId: state.getIn(['sign', 'choosenCryptoProfileId']),
  error: errorSelector(state),
  documents: documentsSelector(state),
  cryptoType: cryptoTypeSelector(state),
  showInstructionInstall: showInstructionInstallSelector(state),
  signPending: signPendingSelector(state),
});
