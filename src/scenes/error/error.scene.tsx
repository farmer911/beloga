import React, { Component } from 'react';
import { UnexpectedErrorSection } from '../../commons/components';

interface ErrorBoundaryStateTypes {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{}, ErrorBoundaryStateTypes> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <UnexpectedErrorSection />;
    }
    return this.props.children;
  }
}
