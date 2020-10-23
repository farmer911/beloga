import React, { Component } from 'react';
import { enhanceSearchTagInput } from '../../../../HOCs';
import styles from './search-form.module.scss';

const EnhanceSearchTagInput = enhanceSearchTagInput();

class SearchForm extends Component {
  render() {
    return (
      <div className={styles['rectangle-4']}>
        <img src="../../images/icons/search_icon.svg" className={styles['search_icon']} />
        {/* <EnhanceSearchTagInput placeHolder="Search" /> */}
      </div>
    );
  }
}

export default SearchForm;
