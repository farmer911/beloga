import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './help.scene.module.scss';
import { RoutePaths } from '../../commons/constants';

class HelpScene extends Component<any>{
    render(){
        return(
            <React.Fragment>
            <div className='container help-scene'>
                <div className={styles['help-title']}>Help Center</div>
            <div className={styles['list-group']}>
                <a href={RoutePaths.HELP_FAQ} className="list-group-item">FAQs</a>
                <a href={RoutePaths.VIDEO_TUTORIALS} className="list-group-item">VIDEO TUTORIALS</a>
            </div>
            </div>
            </React.Fragment>
        )
    }
}
export default connect()(HelpScene);