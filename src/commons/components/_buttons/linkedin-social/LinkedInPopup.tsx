import { Component } from 'react';
import QueryString from 'query-string';
import { LoadingIcon } from '../../loading-icon/loading-icon';
import { loadingWithConfig } from '../../../../HOCs';
const DefaultLoading = loadingWithConfig(LoadingIcon);

export class LinkedInPopUp extends Component {
  componentDidMount() {
    const params = QueryString.parse(window.location.search);
    if (params.error) {
      const errorMessage = params.error_description || 'Login failed. Please try again.';
      window.opener &&
        window.opener.postMessage({ error: params.error, errorMessage, from: 'Linked In' }, window.location.origin);
      // Close tab if user cancelled login
      if (params.error === 'user_cancelled_login') {
        window.close();
      }
    }
    if (params.code) {
      window.opener && window.opener.postMessage({ code: params.code, from: 'Linked In' }, window.location.origin);
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }
  render() {
    return DefaultLoading;
  }
}
