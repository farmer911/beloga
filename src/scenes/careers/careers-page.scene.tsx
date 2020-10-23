import React, { Component } from 'react';
import { selectAuthState } from '../../ducks/auth.duck';
import { fetchCareersAction, selectListCareers, selectIsLoading } from '../../ducks/careers.duck';
import { connect } from 'react-redux';
// import {CareersDetail} from '../careers/careers-detail.scene';
import { RoutePaths } from '../../commons/constants';
import { Link } from 'react-router-dom';
import { loadingWithConfig } from '../../HOCs';
import { LoadingIcon } from '../../commons/components';


interface CareersSceneProps {
  listCareers:any;
  fetchCareersAction:any;
  isLoading: boolean;
}
const DefaultLoadingPage = loadingWithConfig(LoadingIcon);
class Careers extends Component<CareersSceneProps, any> {
  componentWillMount() {
    document.body.classList.add('careers-scene');
    const { fetchCareersAction } = this.props;
    fetchCareersAction();
  }
  componentWillUnmount() {
    document.body.classList.remove('careers-scene');
  }
  onClickCareer (index:any) {
    return <Link to={RoutePaths.CAREERS_DETAIL.getPath(index)}></Link>
  }
  renderCareers () {
    const {listCareers} = this.props;
    if (listCareers && listCareers.results && listCareers.count > 0 ) {
      return listCareers.results.map((item:any, index:number)=> {
        return  <Link key={index} to={RoutePaths.CAREERS_DETAIL.getPath(item.slug)}>
                <div  className="list-group-item" onClick={this.onClickCareer.bind(this,index)}>
                    <div className='careers-name'>{item.job_title}</div>
                    <div className='careers-description'>{item.location}</div>
                  </div>
                  </Link>
      })
    }
    return <div className='video-not-have'>There are no current opportunities.</div>
  }
  render()  {
    const {isLoading} = this.props;
    return isLoading ? (
      <React.Fragment>{DefaultLoadingPage}</React.Fragment>
    ) : (
      <div className="container careers-page">
        <div className='careers-title'>Career Center</div>
        <div className='list-group'>
        {this.renderCareers()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    ...selectAuthState(state),
    listCareers: selectListCareers(state),
    isLoading: selectIsLoading(state)
  };
};

export default connect(
  mapStateToProps,
  { fetchCareersAction}
)(Careers);