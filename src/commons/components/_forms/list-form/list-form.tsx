import React, { Component } from 'react';

class ListForm extends Component<any> {
  render() {
    const { ListComponent } = this.props;
    return (
      <div>
        <ListComponent />
      </div>
    );
  }
}

export default ListForm;
