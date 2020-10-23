import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Notice } from './notice/notice';
import styles from './notification.module.scss';

let seed = 0;
const now = Date.now();

const getUuid = () => {
  return `rcNotification_${now}_${seed++}`;
};

interface NotificationPropTypes {
  style: object;
  maxCount: number;
  closeIcon: ReactNode;
}

interface NotificationState {
  notices: any[];
  opacity: number;
}

export class Notification extends Component<NotificationPropTypes, NotificationState> {
  constructor(props: NotificationPropTypes) {
    super(props);
    this.state = {
      notices: [],
      opacity: 0
    };
  }

  static defaultProps = {
    style: {
      width: '400px'
    }
  };

  newInstance: any;

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        opacity: 1
      });
    }, 5000);
  }

  createChainedFunction = (...args: any[]) => {
    const _args: any = [].slice.call([...args, ...args], 0);
    if (_args.length === 1) {
      return _args[0];
    }

    const chainedFunction = () => {
      for (let i = 0; i < _args.length; i++) {
        if (_args[i] && _args[i].apply) {
          _args[i].apply(this, args);
        }
      }
    };

    return chainedFunction;
  };

  add = (notice: any) => {
    const key = (notice.key = notice.key || getUuid());
    const { maxCount } = this.props;
    this.setState((previousState: any) => {
      const notices = previousState.notices;
      const noticeIndex = notices.map((v: any) => v.key).indexOf(key);
      const updatedNotices = notices.concat();
      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, notice);
      } else {
        if (maxCount && notices.length >= maxCount) {
          notice.updateKey = updatedNotices[0].updateKey || updatedNotices[0].key;
          updatedNotices.shift();
        }
        updatedNotices.push(notice);
      }
      return {
        notices: updatedNotices
      };
    });
  };

  remove = (key: any) => {
    this.setState((previousState: any) => {
      return {
        notices: previousState.notices.filter((notice: any) => notice.key !== key)
      };
    });
  };

  render() {
    const props = this.props;
    const { notices } = this.state;
    const noticeNodes = notices.map((notice: any, index) => {
      const update = Boolean(index === notices.length - 1 && notice.updateKey);
      const key = notice.updateKey ? notice.updateKey : notice.key;
      const onClose = this.createChainedFunction(this.remove.bind(this, notice.key), notice.onClose);
      return (
        <Notice
          {...notice}
          key={key}
          update={update}
          onClose={onClose}
          onClick={notice.onClick}
          closeIcon={props.closeIcon}
        >
          {notice.content}
        </Notice>
      );
    });

    return (
      <div
        className={`notification pos-top pos-right col-md-4 col-lg-3 notification--reveal ${styles['wrapper']}`}
        style={{ opacity: this.state.opacity, ...props.style }}
      >
        {noticeNodes}
      </div>
    );
  }
}

Notification.prototype.newInstance = (properties: any, callback: any) => {
  const _props = properties || {};
  const { getContainer, ...props } = _props;
  const div = document.createElement('div');
  if (getContainer) {
    const root = getContainer();
    root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }
  let called = false;
  function ref(notification: any) {
    if (called) {
      return;
    }
    called = true;
    callback({
      notice(noticeProps: any) {
        notification.add(noticeProps);
      },
      removeNotice(key: any) {
        notification.remove(key);
      },
      component: notification,
      destroy() {
        ReactDOM.unmountComponentAtNode(div);
        div && div.parentNode && div.parentNode.removeChild(div);
      }
    });
  }
  ReactDOM.render(<Notification {...props} ref={ref} />, div);
};
