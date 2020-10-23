import React from 'react';
import styles from './privacy-policy.scene.module.scss';
import { selectListData, privacyAction, selectLoadingPrivacy } from '../../ducks/privacy-policy.duck';
import { connect } from 'react-redux';
import { LoadingIcon } from '../../commons/components';
import { loadingWithConfig } from '../../HOCs';

interface PrivacyPolicyScene {
  listData?: [{content:'', detail:''}];
  privacyAction: any;
  selected: any;
  isLoading: boolean;
}

const DefaultLoading = loadingWithConfig(LoadingIcon);

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    listData: selectListData(state),
    isLoading: selectLoadingPrivacy(state)
  }
}

class PrivacyPolicyScene extends React.Component<PrivacyPolicyScene> {
  componentWillMount(){
    this.props.privacyAction()
  }
  propsText = () => {
    const {listData} = this.props;
    if(listData && listData.length)
    {
      if (listData.length == 1 && listData[0].detail && listData[0].detail != '') {
        return <div key={0}>
          <div dangerouslySetInnerHTML={{ __html: 'No Content' }}></div>
        </div>
      }
      return listData.map((item, index)=>{
        return <div key={index}>
                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
               </div>
               })
    } else {
    return <div>Waiting for Data</div>
    }
  }
  render() {
    const {isLoading}=this.props;
    // if(isLoading && listData.length)
    return isLoading ? (
      <React.Fragment>{DefaultLoading}</React.Fragment>
    ) : (
      <React.Fragment>
        <section className={styles['header-title']}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1>Privacy Policy</h1>
                <hr />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-lg-12">
                <article>
                  {!isLoading && this.propsText()}
                  {isLoading && <LoadingIcon color="#c5cddb"/>}
                </article>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
};

export default connect(
  mapStateToProps,
  { privacyAction }
)(PrivacyPolicyScene);