import './scroll-down-arrow.scss';
import * as React from 'react';
// @ts-ignore
import { getOffset } from './scroll-down-autoload';
let coor = {
  top: 0,
  left: 0
};
class ScrollDownArrow extends React.Component {
  componentDidMount(): void {
    const introSectionEl = document.getElementById('intro-service-id');
    coor = getOffset(introSectionEl);
  }

  scrollToEl = () => {
    window.scrollTo({ top: coor.top, behavior: 'smooth' });
  };

  render() {
    return (
      <a onClick={this.scrollToEl}>
        <span />
      </a>
    );
  }
}

export default ScrollDownArrow;
