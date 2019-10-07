import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import SignModal from './sign-modal';

/**
 * @todo рисуем Sign в body
 */
export default class SignInitialize extends Component {
  static propTypes = {
    store: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.container = document.createElement('div');
    this.container.setAttribute('id', 'SignContainer');
  }

  componentDidMount() {
    document.body.appendChild(this.container);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    document.body.removeChild(this.container);
  }

  render() {
    return ReactDOM.createPortal(
      <Provider store={this.props.store}>
        <SignModal {...this.props} />
      </Provider>,
      this.container
    );
  }
}
