import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SchoolAutoComplete } from '../commons/components/school-input/school-autocomplete';
import { fetchSchoolAction, selectSchoolList } from '../ducks/school.duck';

const enhanceSchoolInput = () => {
  const Wrapper = () => {
    return class extends Component<any> {
      componentWillMount() {
        const { fetchSchoolAction } = this.props;
        fetchSchoolAction();
      }

      componentWillUpdate(nextProps: any) {
        const { fetchSchoolAction } = this.props;
      }

      render() {
        const { suggestSchool } = this.props;
        return <SchoolAutoComplete suggestData={suggestSchool} {...this.props} />;
      }
    };
  };

  const mapStateToProps = (state: any, ownProps: any) => {
    return {
      suggestSchool: selectSchoolList(state)
    };
  };

  return withRouter(
    connect(
      mapStateToProps,
      {
        fetchSchoolAction
      }
    )(Wrapper())
  );
};

export default enhanceSchoolInput;
