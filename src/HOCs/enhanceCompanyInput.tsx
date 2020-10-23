import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CompanyAutoComplete } from '../commons/components/company-input/company-autocomplete';
import { fetchCompanyAction, selectCompanyList } from '../ducks/company.duck';

const enhanceCompanyInput = () => {
  const Wrapper = () => {
    return class extends Component<any> {
      componentWillMount() {
        const { fetchCompanyAction } = this.props;
        fetchCompanyAction();
      }

      componentWillUpdate(nextProps: any) {
        const { fetchCompanyAction } = this.props;
      }

      render() {
        const { suggestCompany } = this.props;
        return <CompanyAutoComplete suggestData={suggestCompany} {...this.props} />;
      }
    };
  };

  const mapStateToProps = (state: any, ownProps: any) => {
    return {
      suggestCompany: selectCompanyList(state)
    };
  };

  return withRouter(
    connect(
      mapStateToProps,
      {
        fetchCompanyAction
      }
    )(Wrapper())
  );
};

export default enhanceCompanyInput;
