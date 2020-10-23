import React, { Component, createRef } from 'react';
import styles from './modal.module.scss';

interface ModalPropTypes {
  isOpen: boolean;
  toggleModal: any;
  size?: 'small' | 'big';
  className?: string;
  existingModal?: boolean;
}

export class Modal extends Component<ModalPropTypes> {
  refModalBody: any;
  state = {
    modalOpacity: 0
  };
  modalContentRef: any;

  constructor(props: any) {
    super(props);
    this.refModalBody = createRef();
  }

  escFunction = (event: any) => {
    if (event.keyCode === 27) {
      this.handleToggleModal();
    }
  };

  handleToggleModal = () => {
    this.props.toggleModal();
    if (this.props.isOpen) {
      this.refModalBody.current.scrollTop = 0;
    }
  };

  handleEventAndStyle = (state: 'add' | 'remove') => {
    switch (state) {
      case 'add': {
        // document.addEventListener('keydown', this.escFunction);
        // document.addEventListener('mousedown', this.handleClickOutModal);
        document.body.classList.add('belooga-body-modal-open');
        return;
      }
      case 'remove': {
        // document.removeEventListener('keydown', this.escFunction);
        // document.removeEventListener('mousedown', this.handleClickOutModal);
        document.body.classList.remove('belooga-body-modal-open');
        return;
      }
    }
  };

  componentWillReceiveProps = (nextProps: any) => {
    if (this.props.isOpen === nextProps.isOpen) {
      return;
    }
    const { isOpen, existingModal, isContactInfoModal } = nextProps;
    setTimeout(() => {
      this.setState({
        modalOpacity: isOpen ? 1 : 0
      });
    }, 100);
    if (typeof existingModal !== undefined && !existingModal) {
      this.handleEventAndStyle(isOpen ? 'add' : 'remove');
    }
  };

  componentWillUnmount() {
    this.handleEventAndStyle('remove');
  }

  handleClickOutModal = (event: any) => {
    if (this.modalContentRef.contains(event.target)) {
      return;
    }
    this.handleToggleModal();
  };

  render() {
    const { modalOpacity } = this.state;
    const { isOpen, children, size = 'small', className } = this.props;
    const modalClass = isOpen ? 'modal fade show' : 'modal fade';
    const modalStyle = {
      display: isOpen ? 'block' : 'none',
      backgroundColor: isOpen ? 'rgba(0,0,0,0.7)' : 'transparent'
    };
    const modalContentStyle = {
      transition: 'opacity 0.15s linear'
    };
    const modalDialogClasses =
      size === 'small' ? 'modal-dialog modal-dialog-centered' : 'modal-dialog modal-dialog-centered modal-lg';
    return (
      <div className={`${className} ${modalClass}`} style={modalStyle} role="dialog">
        <div className={modalDialogClasses} role="document">
          <div
            className={`modal-content ${styles['modal-content']}`}
            style={{ ...modalContentStyle, opacity: modalOpacity }}
            ref={node => (this.modalContentRef = node)}
          >
            <div className={`d-flex justify-content-end modal-close-popup ${styles['popup-close']}`}>
              <a className={styles['close-button']} aria-hidden="true" onClick={this.handleToggleModal}>
                <img src="/images/icons/close-modal.png" />
              </a>
            </div>
            <div className={`modal-body ${styles['modal-body']}`} ref={this.refModalBody}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
