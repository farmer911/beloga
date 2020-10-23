import React, { Component } from 'react';
import styles from './edit-inline.module.scss';

interface EditInlinePropTypes {
  value: string;
  handleChangeValue: any;
  canEdit?: boolean;
}
export class EditInline extends Component<EditInlinePropTypes, any> {
  state = {
    isEdit: false,
    inputValue: ''
  };

  toggleEditInline = () => {
    const { isEdit } = this.state;

    this.setState({
      isEdit: !isEdit
    });
  };

  submitChange = () => {
    const { inputValue } = this.state;
    if (inputValue) {
      const { handleChangeValue } = this.props;
      handleChangeValue(inputValue);
    }
    this.toggleEditInline();
  };

  handleEditInputChange = (e: any) => {
    const value = (e.target as HTMLInputElement).value;
    this.setState({
      inputValue: value
    });
  };

  handleKeyPress = (e: any) => {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      this.submitChange();
    }
  };

  render() {
    const { value, canEdit = true } = this.props;
    const { isEdit } = this.state;
    return (
      <div>
        {isEdit ? (
          <div>
            <input
              type="text"
              className={styles['input']}
              defaultValue={value}
              onChange={this.handleEditInputChange}
              onKeyPress={this.handleKeyPress}
            />
            <div className={styles['button-wrapper']}>
              <span className={styles['button']} onClick={this.submitChange}>
                <i className="fas fa-check" />
              </span>
              <span className={styles['button']} onClick={this.toggleEditInline}>
                <i className="fas fa-times" />
              </span>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <label className="line-title">{value}</label>
            {canEdit ? (
              <i
                className={`${styles['icon-style']} ${styles['space-left']} fas fa-pencil-alt`}
                title="Edit"
                onClick={this.toggleEditInline}
              />
            ) : (
              ''
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}
