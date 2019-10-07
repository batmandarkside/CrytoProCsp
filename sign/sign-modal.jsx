import React, { Component }       from 'react';
import PropTypes                  from 'prop-types';
import { connect }                from 'react-redux';
import Modal                      from 'components/ui-components/modal';
import { bindActionCreators }     from 'redux';
import * as SignAction            from './actions';
import { mapStateToProps }        from './selectors';
import Sign                       from './index';


class SignModal extends Component {
  static propTypes = {
    showSignModal: PropTypes.bool.isRequired,
    showSignModalAction: PropTypes.func.isRequired,

    // @todo оставить
    // при входе в систему показать нотификацию что плагин не установлен
    // showInfoPluginAction: PropTypes.func.isRequired,
  }

  _onClose = () => {
    const { showSignModalAction } = this.props;
    showSignModalAction(false);
  }

  render() {
    const { showSignModal } = this.props;

    if (!showSignModal) {
      return null;
    }

    return (
      <Modal
        stopClose
        onClose={this._onClose}
        classNameContent="b-modal-sign-content"
      >
        <Sign {...this.props} />
      </Modal>
    );
  }
}


export default connect(
  mapStateToProps,
  dispatch => bindActionCreators({
    ...SignAction
  }, dispatch)
)(SignModal);
