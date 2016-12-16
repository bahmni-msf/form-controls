import React, { PropTypes, Component } from 'react';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import { controlStateFactory, getErrors } from 'src/ControlState';

export class Container extends Component {
  constructor(props) {
    super(props);
    this.childControls = {};
    const { observations, metadata } = this.props;
    const data = controlStateFactory(metadata, observations);
    this.state = { errors: [], data };
    this.storeChildRef = this.storeChildRef.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  onValueChanged(obs, errors) {
    const bahmniRecord = this.state.data.getRecord(obs.formNamespace)
      .set('obs', obs)
      .set('errors', errors);
    const data = this.state.data.setRecord(bahmniRecord);
    this.setState({ data });
  }

  getValue() {
    const records = this.state.data.getRecords();
    const observations = this._getObservations(records.map((record) => record.obs.toJS()));
    const errors = getErrors(records);
    if (isEmpty(observations) || this.areAllVoided(observations) || isEmpty(errors)) {
      return { observations };
    }

    return { errors };
  }

  /* eslint-disable no-param-reassign */
  _getObservations(observations) {
    return filter([].concat(...observations), (obs) => {
      if (!isEmpty(obs.groupMembers)) {
        obs.groupMembers = this._getObservations(obs.groupMembers);
      }
      return this._isValidObs(obs);
    });
  }
  /* eslint-disable no-param-reassign */

  // deprecated
  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  _isNewVoidedObs(obs) {
    return !obs.uuid && obs.voided;
  }

  _isValidObs(obs) {
    return !this._isNewVoidedObs(obs);
  }

  areAllVoided(observations) {
    return observations.every((obs) => obs.voided);
  }

  render() {
    const { metadata: { controls, uuid: formUuid }, validate } = this.props;
    const childProps = {
      errors: this.state.errors,
      formUuid,
      ref: this.storeChildRef,
      onValueChanged: this.onValueChanged,
      validate,
    };
    const groupedRowControls = getGroupedControls(controls, 'row');
    const records = this.state.data.getRecords();
    return (
      <div>{displayRowControls(groupedRowControls, records, childProps)}</div>
    );
  }
}

Container.propTypes = {
  metadata: PropTypes.shape({
    controls: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        type: PropTypes.string.isRequired,
      })).isRequired,
    id: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }),
  observations: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
};
