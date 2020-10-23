import React, { Component } from 'react';
import { connect } from 'react-redux';

import { selectUserInfo, getUserPublicAction } from '../ducks/user-public.duck';

const enhanceGenericListPublic = (GenericListComponent: any, ListItemComponent: any) => {
  const Wrapper = () => {
    return class extends Component<any> {
      render() {
        const { listItemProps, isLoading } = this.props;

        return (
          <React.Fragment>
            <GenericListComponent
              ListItemComponent={ListItemComponent}
              listItemProps={{
                ...listItemProps
              }}
              isLoading={isLoading}
              {...this.props}
              mode="readonly"
            />
          </React.Fragment>
        );
      }
    };
  };

  const mapStateToProps = (state: any, ownProps: any) => {
    return {
      userInfo: selectUserInfo(state)
    };
  };

  return connect(
    mapStateToProps,
    {
      getUserPublicAction
    }
  )(Wrapper());
};

export default enhanceGenericListPublic;
