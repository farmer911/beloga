import * as React from 'react';
import $ from 'jquery';
require('./report-profile-menu.modules.scss');
interface IReportProfileMenuProps {
  toggleReportModal: Function;
}
interface IReportProfileMenuStates {
  isShowMenu: boolean;
}
class ReportProfileMenu extends React.PureComponent<IReportProfileMenuProps, IReportProfileMenuStates> {
  constructor(props: IReportProfileMenuProps) {
    super(props);
    this.state = {
      isShowMenu: false
    };
  }
  componentDidMount() {
    $(document).click(event => {
      if (this.state.isShowMenu) {
        this.onShowMenuReport();
      }
      event.stopPropagation();
    });
    $('#menu-report-button-id').click(event => {
      this.onShowMenuReport();
      event.stopPropagation();
    });
  }
  onToggleReportModal = () => {
    this.onShowMenuReport();
    this.props.toggleReportModal();
  };

  onShowMenuReport = () => {
    this.setState({
      isShowMenu: !this.state.isShowMenu
    });
  };

  render() {
    const { isShowMenu } = this.state;
    return (
      <div style={{ border: 'none', position: 'relative', width: 25, height: 15, zIndex: 995 }}>
        <i
          id="menu-report-button-id"
          className="fas fa-ellipsis-h"
          style={{ position: 'absolute', top: 0, right: 0, paddingBottom: 10, paddingLeft: 10 }}
        />
        <div
          id="menu-list-report-id"
          style={{
            position: 'absolute',
            top: 20,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid rgb(240,240,240)',
            display: !isShowMenu ? 'none' : undefined
          }}
        >
          <ul style={{ textDecoration: 'none' }}>
            <li className="report-normal" onClick={this.onToggleReportModal}>
              <i className="fas fa-flag" style={{ color: '#5bbbae' }} />&nbsp;&nbsp;&nbsp;Report
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ReportProfileMenu;
