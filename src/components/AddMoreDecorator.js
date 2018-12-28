import React from 'react';
import find from 'lodash/find';
import { AddMore } from 'components/AddMore.jsx';

const addMoreDecorator = Sup => class extends Sup {
  showAddMore() {
    const { metadata: { properties } } = this.props;
    const isAddMoreEnabled = find(properties, (value, key) => (key === 'addMore' && value));
    if (isAddMoreEnabled) {
      return (
        <AddMore canAdd={ this.props.showAddMore }
          canRemove={ this.props.showRemove }
          enabled={ this.props.enabled }
          onAdd={this.onAddControl}
          onRemove={this.onRemoveControl}
        />
      );
    }
    return null;
  }

  onAddControl() {
    this.props.onControlAdd(this.props.formFieldPath);
  }

  onRemoveControl() {
    console.log("this removed value", this);
    this.props.onControlRemove(this.props.formFieldPath);
  }
};

export default addMoreDecorator;
