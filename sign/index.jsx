import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from '@rbo/components/lib/loader/Loader';
import { connect }                from 'react-redux';
import { List }      from 'immutable';
import { bindActionCreators }     from 'redux';
import CryptoProService           from '@rbo/crypto-pro-csp';
import * as SignAction            from './actions';
import { mapStateToProps }        from './selectors';
import { InstructionInstall }     from './instruction-install';
import DocInfo                    from './doc-info';
import SmsSigning                 from './sms-signing';
import './style.css';


class Sign extends Component {
  static propTypes = {
    documents: PropTypes.instanceOf(List).isRequired,
    cryptoProfilesLoader: PropTypes.bool,
    createSignLoader: PropTypes.bool,
    signPending: PropTypes.bool,
    showInstructionInstall: PropTypes.bool,
    cryptoType: PropTypes.string,
    signCreateAction: PropTypes.func,
    clearSignDataAction: PropTypes.func
  };

  static defaultProps = {
    doc: {
      docName: '',
      docNumber: '',
      docDate: '',
      type: ''
    }
  };

  constructor(props) {
    super(props);
    this.state.isSmsSigning = props.cryptoType === 'sms';
  }

  state = {
    isSmsSigning: false,
    canSignCryptoPro: true,
    isDetailsOpen: false
  }

  componentWillUnmount() {
    this.props.clearSignDataAction();
  }

  onChooseSign = (item) => {
    const { signCreateAction } = this.props;
    const state = {
      canSignCryptoPro: false,
      isSmsSigning: false
    };
    if (item && item.get('cryptoType') === 'sms') {
      this.setState({ isSmsSigning: true });
      signCreateAction({
        cryptoProfileId: item.get('cryptoProfileId')
      }, 'sms');
    } else {
      /**
       * если выбрали вариант подписи CryptoPro,
       * проверяем установлен ли плагин
       * если нет, то показываем попап с информацией как это сделать
       */

      CryptoProService.pluginInfo()
        .then((info) => {
          if (info && info.enabled) {
            console.log(`%c  plugin version === ${info.version}`, 'background: #222; color: #bada55'); // eslint-disable-line
            signCreateAction({
              cryptoProfileId: item.get('cryptoProfileId')
            });
          } else {
            this.setState(state);
          }
        })
        .catch(() => this.setState(state));
    }
  }

  chooseSignRender = () => {
    const { documents, cryptoProfilesLoader, createSignLoader, signPending } = this.props;
    const cryptoProfiles = documents.first().get('cryptoProfiles');

    return (
      <div className="b-sign__chooselist">
        {(cryptoProfilesLoader || createSignLoader || signPending) && <Loader centered />}
        <div className="b-sign__chooselist-title">Выберите способ подписи</div>
        {cryptoProfiles.map((item, index) =>
          <CryptoTypeItem
            item={item}
            key={index}
            signPending={signPending}
            onChangeSing={this.onChooseSign}
          />
        )}
      </div>
    );
  }

  toggle = (e) => {
    e.preventDefault();
    this.setState({ isDetailsOpen: !this.state.isDetailsOpen });
  }

  render() {
    const { isSmsSigning, canSignCryptoPro } = this.state;
    const {
      documents,
      createSignLoader,
      showInstructionInstall
    } = this.props;

    if (!canSignCryptoPro || showInstructionInstall) {
      return (
        <div className="b-sign-component">
          <div className="b-sign">
            <InstructionInstall />
          </div>
        </div>
      );
    }

    return (
      <div className="b-sign-component">
        <div className="b-sign">
          <div>
            <div className="b-sign__title">Подпись документа</div>
            <DocInfo documents={documents} />

            {createSignLoader && <Loader centered />}

            {!isSmsSigning
              ? this.chooseSignRender()
              : <SmsSigning />
            }
          </div>
        </div>
      </div>
    );
  }
}


/**
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
const CryptoTypeItem = (props) => {
  function onChangeSing() {
    props.onChangeSing(props.item);
  }

  return (
    <div
      className={`b-sign__chooseitem s-like-link  ${props.signPending ? 'disable' : ''}`}
      onClick={!props.signPending ? onChangeSing : null}
    >
      <span className="b-sign__chooseitem-type">{props.item.get('Type')}</span>
      {' / '}
      <span className="b-sign__chooseitem-name">{props.item.get('Name')}</span>
    </div>
  );
};

CryptoTypeItem.propTypes = {
  onChangeSing: PropTypes.func,
  item: PropTypes.object,
  signPending: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators({
    ...SignAction
  }, dispatch)
)(Sign);

