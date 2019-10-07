/* eslint-disable no-unused-vars */
import chai, { expect }   from 'chai';
import chaiImmutable      from 'chai-immutable';
import sign, {
  saveDocForSign
}  from '../reducer';

chai.use(chaiImmutable);

describe('Sign reducer tests', () => {
  const defaultState = sign(undefined, { type: null });

  it('defaultState test ', () => {
    expect(defaultState).to.have.deep.property('saveDocIdForFutureSign').to.be.empty;
    expect(defaultState).to.have.deep.property('cryptoProfilesLoader').to.be.false;
    expect(defaultState).to.have.deep.property('showSignModal').to.be.false;
  });

  test('saveDocForSign test ', () => {
    expect(defaultState.get('saveDocIdForFutureSign')).to.be.empty;
    const result  = saveDocForSign(defaultState, {
      docIds: '29834562873467234',
      visa: false
    });
    expect(result.get('saveDocIdForFutureSign')).to.eql('29834562873467234');
  });

  test('saveDocForSign with visa', () => {
    expect(defaultState.get('saveDocIdForFutureSign')).to.be.empty;
    const result  = saveDocForSign(defaultState, {
      docIds: '29834562873467234',
      visa: true
    });
    expect(result.get('saveDocIdForFutureSign')).to.eql('29834562873467234');

    const saveDocVisa = result.get('saveDocVisa').toJS();
    expect(saveDocVisa).to.eql({
      docIds: '29834562873467234',
      visa: true
    });
  });
});
