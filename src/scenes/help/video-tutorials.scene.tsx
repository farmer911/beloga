import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './help.scene.module.scss';
import { selectAuthState } from '../../ducks/auth.duck';
import Iframe from 'react-iframe';
import {  Modal } from '../../commons/components';
import { fetchHelpVideoAction, selectListHelpVideo, selectIsLoading } from '../../ducks/help.duck';
import { LoadingIcon } from './../../commons/components/loading-icon/loading-icon';
import { loadingWithConfig } from '../../HOCs';
interface HelpSceneProps {
  listVideo?: { count: ''; next: ''; previous:''; results: [{content:''; cover_image:''; name:''; video:''}] };
  fetchHelpVideoAction: any;
  isLoading: boolean;
}
const DefaultLoadingPage = loadingWithConfig(LoadingIcon);

class VideoTutorial extends Component<HelpSceneProps> {
  state = {
    random: 0,
    showHelpFirst: false,
    showHelpSecond: false,
    showHelpThird: false,
    isSelect: -1
  };
  listVideo = { count: '', next: '', previous:'', results: [{content:'', cover_image:'', name:'', video:''}] };
  componentWillMount() {
    document.body.classList.add('help-scene');
    const { fetchHelpVideoAction } = this.props;
    fetchHelpVideoAction();
  }
  componentWillUnmount() {
    document.body.classList.remove('help-scene');
  }
  toggleShowHelp = (id:number) => {
    this.setState({
      random: this.state.random +1,
      isSelect: id
    })
  }
  toggleHideHelp = () => {
    this.setState({
      random: this.state.random +1,
      isSelect: -1
    })
  }
  renderModalVideo() {
    const {listVideo} = this.props;
    if(listVideo) {
    let data = listVideo.results;
    if (data && data.length > 0){
    return data.map((item, index) => {
      return <Modal key={index} isOpen={this.state.isSelect == index} toggleModal={this.toggleHideHelp} className="view-video-modal">
      <Iframe
        key={this.state.random}
        url={item.video}
        width="100%"
        height="auto"
        className="example-video-iframe"
        display="initial"
        position="relative"
        allowFullScreen
      />
    </Modal>
    })}
  } return <div className={styles['content-show']}>Don't have any Video</div>;
  }
  renderContentVideo() {
    const {listVideo} = this.props;
    if(listVideo) {
      let data = listVideo.results;
      if (data && data.length > 0){
        return data.map((item, index)=> {
          if ((index % 2) == 1) {
            return (
              <div key={index} className="col-12 col-md-12 stated-video">
                    <div className="col-12 col-md-6 video-content">
                    <div className="stated-text">
                        <h3>{item.name}</h3> 
                        <div className="text-video-tutorials" dangerouslySetInnerHTML={{ __html: item.content }}>
                        </div>
                      </div>
                      </div>
                      <div className="col-12 col-md-6 start-content-video">
                      <div className="modal-instance modal-start">
                        <div
                          className="video-play-icon modal-trigger"
                          data-modal-index="0"
                          onClick={this.toggleShowHelp.bind(this, index)}
                        />
                      </div>
                      <img src={item.cover_image} className="attachment-large size-large video-tutorials-img"/>
                      </div>
                    </div>
            )
          }
          return (<div key={index} className="col-12 col-md-12 stated-video">
          <div className="col-12 col-md-6 start-content-video">
          <div className="modal-instance modal-start">
            <div
              className="video-play-icon modal-trigger"
              data-modal-index="0"
              onClick={this.toggleShowHelp.bind(this, index)}
            />
          </div>
          <img src={item.cover_image} className="attachment-large size-large video-tutorials-img"/>
          </div>
          <div className="col-12 col-md-6 video-content">
          <div className="stated-text">
            <h3>{item.name}</h3>
            <div className="text-video-tutorials" dangerouslySetInnerHTML={{ __html: item.content }}>
            </div>
          </div>
          </div>
        </div>)
        })}
      }
      return <div className='video-not-have'>We don't have any Video</div>
  }
    render(){
      const {isLoading} = this.props;
        return isLoading ? (
          <React.Fragment>{DefaultLoadingPage}</React.Fragment>
        ) : (
            <>
            <div className='container'>
              {this.renderModalVideo()}
              <div className="row">
                <div className={styles['help-title-video']}>VIDEO TUTORIALS</div>
                  {this.renderContentVideo()}
              </div>
            </div>
            </>
        )
    }
}
const mapStateToProps = (state: any) => {
  return {
    ...selectAuthState(state),
    listVideo: selectListHelpVideo(state),
    isLoading: selectIsLoading(state)
  };
};
export default connect(
  mapStateToProps,
  { fetchHelpVideoAction }
)(VideoTutorial);