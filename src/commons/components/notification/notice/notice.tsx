import React, { Component } from 'react';
import styles from './notice.module.scss';

interface NoticePropTypes {
  duration: number;
  onClose: Function;
  children: any;
  update: boolean;
  style: any;
  onClick: any;
  closable: any;
  closeIcon: any;
}

export class Notice extends Component<NoticePropTypes> {
  static defaultProps = {
    onEnd: () => {},
    onClose: () => {},
    duration: 3,
    closable: true
  };

  state = {
    opacity: 0
  };

  closeTimer: any;

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        opacity: 1
      });
    }, 50);
    this.startCloseTimer();
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.duration !== prevProps.duration || this.props.update) {
      this.restartCloseTimer();
    }
  }

  componentWillUnmount() {
    this.setState({
      opacity: 0
    });
    this.clearCloseTimer();
  }

  close = () => {
    this.clearCloseTimer();
    this.props.onClose();
  };

  startCloseTimer = () => {
    if (this.props.duration) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.props.duration * 1000);
    }
  };

  clearCloseTimer = () => {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  };

  restartCloseTimer() {
    this.clearCloseTimer();
    this.startCloseTimer();
  }

  render() {
    const props = this.props;
    return (
      <div
        className={styles['transition']}
        style={{ opacity: this.state.opacity, ...props.style }}
        onMouseEnter={this.clearCloseTimer}
        onMouseLeave={this.startCloseTimer}
        onClick={props.onClick}
      >
        <div
          className={`boxed boxed--border border--round box-shadow ${styles['align-middle']}`}
          style={{ minWidth: 290 }}
        >
          {props.closable ? <div className="notification-close-cross notification-close" onClick={this.close} /> : null}
          <div>{props.children}</div>
        </div>
      </div>
    );
  }
}
