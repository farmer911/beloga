import React, { Component } from 'react';
import { any } from 'prop-types';

interface AlertPropTypes {
  type: 'success' | 'alert';
  message?: string | null;
}
export class Alert extends Component<AlertPropTypes, any> {
  state = {
    classAlert: 'alert'
  };
  handelCloseAlert = () => {
    this.setState({
      classAlert: `${this.state.classAlert} alert--dismissed`
    });
  };

  componentDidMount() {
    const { type } = this.props;
    const { classAlert } = this.state;
    switch (type) {
      case 'alert': {
        this.setState({
          classAlert: `${classAlert} bg--error`
        });
        break;
      }
      case 'success': {
        this.setState({
          classAlert: `${classAlert} bg--success`
        });
        break;
      }
    }
  }

  render() {
    const { type, message } = this.props;
    const { classAlert } = this.state;

    return (
      <div className={classAlert}>
        <div className="alert__body">
          <span>{message}</span>
        </div>
        <div className="alert__close" onClick={this.handelCloseAlert}>
          ×
        </div>
      </div>
    );
  }
}
