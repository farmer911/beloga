import React, { Component } from 'react';
import styles from './back-to-top.module.scss';

let lastScrollY = 0;
let ticking = false;

export class BackToTop extends Component {
  state: any;
  props: any;

  constructor(props: any) {
    super(props);
    this.state = {
      intervalId: 0,
      custom_class: 'no-class'
    };
    this.scrollToTop = this.scrollToTop.bind(this);
    this.scrollStep = this.scrollStep.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (lastScrollY >= 300) {
          this.setState({ custom_class: 'back-to-top' });
        } else {
          this.setState({ custom_class: 'no-class' });
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  scrollStep() {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - Number(this.props.scrollStepInPx));
  }

  scrollToTop() {
    const intervalId = setInterval(this.scrollStep.bind(this), Number(this.props.delayInMs));
    this.setState({ intervalId: intervalId, custom_class: 'back-to-top' });
  }

  render() {
    return (
      <a
        className={`back-to-top inner-link ${styles[this.state.custom_class]}`}
        onClick={() => {
          this.scrollToTop();
        }}
      >
        <i className="stack-interface stack-up-open-big" />
      </a>
    );
  }
}
