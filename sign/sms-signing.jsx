import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { connect }                 from 'react-redux';
import { Map, fromJS }             from 'immutable';
import { ERRORS }                  from 'utils/errors';
import RboForm, {
  RboFormSection as Section,
  RboFormRow as Row,
  RboFormCell as Cell,
  RboFormError as Error,
  RboFormFieldset as Fieldset,
  RboFormFieldText as FieldText,
  RboFormFieldButton as FieldButton
} from 'components/ui-components/rbo-form-compact';
import * as SignAction             from './actions';
import { secondsToTime }           from './util';
import { mapStateToProps }         from './selectors';

const wrongCredentialsError = ERRORS.sign.wrong_temporal_credentials;

class SmsSigning extends Component {
  static propTypes = {
    signCreateAction: PropTypes.func,
    signSmsDocumentAction: PropTypes.func,
    signSetSmsCodeAction: PropTypes.func,
    clearSignDataAction: PropTypes.func,
    cryptoProfileId: PropTypes.string.isRequired,
    error: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    createSignResult: fromJS({}),
    error: fromJS({
      message: ''
    }),
    cryptoProfileId: ''
  };

  state = {
    timeToExpire: '',
    value: '',
    timerId: null
  };

  componentDidMount() {
    setTimeout(this.focus, 0);
  }

  componentWillReceiveProps(nextProps) {
    const newData = nextProps.createSignResult.get('data');
    const errorMessage = nextProps.error.get('message');

    if (newData && !this.state.timerId) {
      this.setState({
        timeToExpire: newData,
        timerId: setInterval(this.timer, 1000)
      }, () => {
        setTimeout(this.focus, 0);
      });
    }

    if (errorMessage) {
      this.setState({
        value: ''
      });
      this.focus();
    }
    this.isTrySign = false;
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
    this.setState({ timerId: null });
  }

  onSubmit = () => {
    if (!this.isTrySign) {
      this.isTrySign = true;
      this.sendSign();    
    }        
  }

  sendSign = debounce(() => {    
    this.props.signSetSmsCodeAction(this.state.value);
    this.props.signSmsDocumentAction();
  }, 500)

  timer = () => {
    if (this.state.timeToExpire > 0) {
      this.setState({ timeToExpire: this.state.timeToExpire - 1 });
    } else {
      clearInterval(this.state.timerId);
    }
  };

  handleChange = ({ fieldValue }) => {
    this.setState({ value: fieldValue });
  }

  isTrySign = false;

  focus = () => {
    document.querySelector('#SmsCode').focus();
  };


  _regenSmsCode = () => {
    const {
      cryptoProfileId,
      signCreateAction,
      clearSignDataAction,
    } = this.props;

    clearInterval(this.state.timerId);
    this.setState({ timerId: null });

    clearSignDataAction();

    signCreateAction({
      cryptoProfileId
    }, 'sms');
  }

  render() {
    const { timeToExpire, value } = this.state;

    const errorMessage = this.props.error.get('message');
    const errorIsNonBlocking = !errorMessage || (errorMessage === wrongCredentialsError);
    const isSendButtonDisable = !(value && value.length > 0) || (errorMessage && !errorIsNonBlocking) || !timeToExpire;

    return (
      <div className="b-sign__confirmation">
        <div className="b-sign__confirmation-text">Для подтверждения операции
          введите одноразовый пароль, который получили по SMS.</div>

        <div className="b-sign__confirmation-text _bold">
          { !!timeToExpire && `Пароль действителен: ${secondsToTime(timeToExpire)}` }
        </div>
        <RboForm
          onSubmit={this.onSubmit}
        >
          <Section>
            <Row>
              <Cell>
                <Fieldset>
                  <FieldText
                    id="SmsCode"
                    size="184px"
                    value={value}
                    maxLength={16}
                    isDisabled={(!!errorMessage && !errorIsNonBlocking) || !timeToExpire}
                    isError={!!errorMessage}
                    onChange={this.handleChange}
                  />
                  <FieldButton
                    id="SmsSubmit"
                    size="auto"
                    isPrimary
                    align="left"
                    title="Подтвердить"
                    isDisabled={isSendButtonDisable}
                    onClick={this.onSubmit}
                  />
                </Fieldset>
                {errorMessage &&
                <Error>{errorMessage}</Error>
                }
                {timeToExpire === 0 &&
                <Error>Время действия пароля истекло</Error>
                }
              </Cell>
            </Row>
            <Row>
              <Cell>
                <FieldButton
                  id="SmsRepeatSend"
                  align="left"
                  title="Получить код повторно"
                  isDisabled={errorIsNonBlocking && !!timeToExpire}
                  onClick={this._regenSmsCode}
                />
              </Cell>
            </Row>
          </Section>
        </RboForm>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  SignAction
)(SmsSigning);
