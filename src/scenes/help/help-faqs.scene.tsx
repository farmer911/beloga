import React, { Component } from 'react';
import { selectAuthState } from '../../ducks/auth.duck';
import { connect } from 'react-redux';
import { fetchHelpAction, selectListHelp, selectIsLoading } from '../../ducks/help.duck';
import styles from './help.scene.module.scss';
import { LoadingIcon } from './../../commons/components/loading-icon/loading-icon';
import { loadingWithConfig } from '../../HOCs';

interface HelpSceneProps {
  listHelp?: [{ question: ''; answer: '' }];
  fetchHelpAction: any;
  isLoading: boolean;
}
interface HelpSceneStateTypes {
  onShow?: any;
  selected?: any;
}
const DefaultLoadingPage = loadingWithConfig(LoadingIcon);
class HelpFAQsScene extends Component<HelpSceneProps, HelpSceneStateTypes> {
  constructor(props: HelpSceneProps) {
    super(props);
    this.state = {
      onShow: false,
      selected: ''
    };
  }
  listHelp = [
    {
      title: '',
      content: ''
    }
  ];
  componentWillMount() {
    document.body.classList.add('help-scene');
    const { fetchHelpAction } = this.props;
    fetchHelpAction();
  }
  componentWillUnmount() {
    document.body.classList.remove('help-scene');
  }
  onShowContent = (id: any) => {
    const { onShow, selected } = this.state;
    if (id !== selected) {
      this.setState({ onShow: true, selected: id });
    }
    if (id === selected) {
      this.setState({ onShow: !onShow });
    }
  };
  renderFAQs = () => {
    const { listHelp } = this.props;
    const { onShow, selected } = this.state;
    if (listHelp && listHelp.length >= 1) {
      return listHelp.map((item, index) => {
        return (
          <div key={index} onClick={this.onShowContent.bind(this, index)} className={styles['faq-item']}>
            <span className={`${styles['list-group-item-custom']} list-group-item`}>
              <p>{item.question}</p>
              {onShow && selected === index ? (
                <i className="fa fa-chevron-down" />
              ) : (
                <i className="fa fa-chevron-right" />
              )}
            </span>

            <div
              className={onShow && selected === index ? styles['content-show'] : styles['content-not-show']}
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </div>
        );
      });
    }
    return <div className={styles['content-show']}>Don't have any FAQ</div>;
  };
  render() {
    const { isLoading, listHelp } = this.props;
    return isLoading ? (
      <React.Fragment>{DefaultLoadingPage}</React.Fragment>
    ) : (
      <React.Fragment>
        <div className="container">
          <div className={styles['help-title-faq']}>FAQs</div>
          <div className={styles['list-group-faqs']}>{this.renderFAQs()}</div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state: any) => {
  return {
    ...selectAuthState(state),
    listHelp: selectListHelp(state),
    isLoading: selectIsLoading(state)
  };
};
export default connect(
  mapStateToProps,
  { fetchHelpAction }
)(HelpFAQsScene);
