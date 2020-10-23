import React, { Component } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import styles from './report.module.scss';
import { Dispatch } from 'redux';
import { selectListData, reportAction } from '../../../../ducks/report-get-list.duck';
import { selectPostListData, postContent, selectUser } from '../../../../ducks/report-post-list.duck';
import { NotificationService } from '../../../../services';

interface ReportPropTypes {
  isOpenReportModal: boolean;
  canEdit?: boolean;
  listData?: [{ content: ''; id: '' }];
  reportAction?: any;
  postContent?: any;
  user?: Object;
  showHiddenText: boolean;
}
interface ReportStateTypes {
  selectedOption: string;
  textAnotherReason: string;
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    listData: selectListData(state),
    postData: selectPostListData(state),
    user: selectUser(state)
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    reportAction: () => dispatch(reportAction()),
    postContent: (user: Object, content: String) => dispatch(postContent(user, content))
  };
};

class Report extends Component<ReportPropTypes, ReportStateTypes> {
  inputAnotherReason: any;
  constructor(props: ReportPropTypes) {
    super(props);
    this.state = {
      selectedOption: '',
      textAnotherReason: ''
    };
  }

  componentDidUpdate(prevProps: ReportPropTypes) {
    if (prevProps.isOpenReportModal !== this.props.isOpenReportModal && !this.props.isOpenReportModal) {
      this.resetData();
      $('[name=selectedOption]').prop('checked', false);
    }
  }

  componentDidMount() {
    this.props.reportAction();
    this.inputAnotherReason = document.getElementById('another-reason-input-id');
  }
  showList = () => {
    const { listData } = this.props;
    if (listData) {
      return listData.map((item, index) => {
        return (
          <div className={styles['report-button']} key={item.id}>
            <input
              className="radio-button"
              type="radio"
              name="selectedOption"
              onChange={this.onCheckChange}
              value={item.content}
            />
            <div className={styles['content-report']} id="content-report">
              {item.content}
            </div>
          </div>
        );
      });
    }
    return null;
  };

  onCheckChange = (e: any) => {
    this.setState({
      selectedOption: e.target.value,
      textAnotherReason: ''
    });
    if (e.target.value === 'Another Reason' && this.inputAnotherReason !== null) {
      setTimeout(() => {
        $(this.inputAnotherReason).focus();
      }, 50);
    }
  };

  onChangeAnotherReason = (e: any) => {
    this.setState({
      textAnotherReason: e.target.value
    });
  };

  showHidden = () => {
    return (
      <div className={styles['content-report']} style={{ width: '100%' }}>
        <textarea
          id="another-reason-input-id"
          name="textAnotherReason"
          className={styles['form-control']}
          value={this.state.textAnotherReason}
          rows={3}
          disabled={!(this.state.selectedOption == 'Another Reason')}
          onChange={this.onChangeAnotherReason}
          style={{ height: '100%', fontSize: 13 }}
          placeholder="Please type your reason..."
        />
      </div>
    );
  };

  resetData = () => {
    this.setState({
      selectedOption: '',
      textAnotherReason: ''
    });
  };

  handleSubmit = (e: any) => {
    const { postContent } = this.props;
    e.preventDefault();
    if (this.state.selectedOption === '' && this.state.textAnotherReason === '') {
      NotificationService.notify('Please choose a reason to report.');
      return;
    }
    if (this.props.user) {
      if (this.state.textAnotherReason !== '') {
        postContent(this.props.user, this.state.textAnotherReason);
        return;
      }
      postContent(this.props.user, this.state.selectedOption);
    }
  };

  render() {
    return (
      <div className="text-block" style={{ margin: 0 }}>
        <div className={styles['contact-title-block']}>Report</div>
        <div style={{ padding: '20px 0px', minHeight: 200 }}>
          {this.showList()}
          <div className={styles['report-button']}>
            <input type="radio" name="selectedOption" value={'Another Reason'} onChange={this.onCheckChange} />
            <div className={styles['content-report']}>Other</div>
          </div>
          <div className={styles['report-button']}>{this.showHidden()}</div>
        </div>

        <div className={styles['text-center']} style={{ marginTop: 10 }}>
          <div className={styles['modal-submit-button']}>
            <a className={styles['btn-upload-video']} onClick={this.handleSubmit}>
              Submit
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Report);
