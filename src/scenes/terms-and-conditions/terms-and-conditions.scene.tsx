import React from 'react';
import styles from './terms-and-conditions.scene.module.scss';
import { connect } from 'react-redux';
import {selectListData, termAction,selectLoadingTermCondition} from '../../ducks/terms-conditions.duck';
import { LoadingIcon } from '../../commons/components';
import { loadingWithConfig } from '../../HOCs';

interface TermsConditionsScene {
  listData?: [{content:'', detail: ''}];
  termAction: any;
  selected: any;
  isLoading: boolean;
}

const DefaultLoading = loadingWithConfig(LoadingIcon);

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    listData: selectListData(state),
    isLoading: selectLoadingTermCondition(state)
  }
}

class TermsConditionsScene extends React.Component<TermsConditionsScene> {
  componentWillMount() {
    this.props.termAction();
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
    const {isLoading} = this.props;
  return isLoading ? (
    <React.Fragment>{DefaultLoading}</React.Fragment>
  ) : (
    <React.Fragment>
      <section className={styles['header-title']}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>Terms &amp; Conditions</h1>             
              <hr />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-12">
              {this.propsText()}
              {isLoading && <LoadingIcon color="#c5cddb"/>}          
            </div>
          </div>
        </div>
      </section>
      </React.Fragment>
   );
  }
}

export default connect(
  mapStateToProps,
  { termAction }
)(TermsConditionsScene);