import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';

export class FreeTextAutoComplete extends Component {
  constructor(props) {
    super(props);
    const { options, value } = props;
    const errors = this._getErrors(props.value) || [];
    const hasErrors = !isEmpty(errors);
    this.state = { options, value, hasErrors };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  _getErrors(value) {
    const { validations, hidden, enabled } = this.props;
    const controlDetails = {
      validations,
      value,
      hidden,
      enabled,
    };
    return Validator.getErrors(controlDetails);
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.options !== newProps.options || this.props.value !== newProps.value) {
      const errors = this._getErrors(newProps.value);
      this.setState({ options: newProps.options, value: newProps.value, hasErrors: this._hasErrors(errors) });
    } else if (newProps.validate) {
      const errors = this._getErrors(newProps.value);
      this.setState({ hasErrors: this._hasErrors(errors) });
    }
  }

  handleOnChange(value) {
    const errors = this._getErrors(value);
    this.setState({ value, hasErrors: this._hasErrors(errors) });
    this.props.onChange({ value, errors });
  }

  render() {
    const { options, value } = this.state;
    const { multi, clearable, backspaceRemoves, deleteRemoves } = this.props;
    return (
      <Select.Creatable
        backspaceRemoves={backspaceRemoves}
        clearable={clearable}
        deleteRemoves={deleteRemoves}
        multi={multi}
        onChange={this.handleOnChange}
        options={options}
        value={value}
      />
    );
  }
}

FreeTextAutoComplete.propTypes = {
  backspaceRemoves: PropTypes.bool.isRequired,
  clearable: PropTypes.bool.isRequired,
  deleteRemoves: PropTypes.bool.isRequired,
  locale: PropTypes.string,
  multi: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  translationKey: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  validations: PropTypes.array,
  hidden: PropTypes.bool,
  enabled: PropTypes.bool,
  validate: PropTypes.bool,
};

FreeTextAutoComplete.defaultProps = {
  multi: false,
  clearable: false,
  backspaceRemoves: false,
  deleteRemoves: false,
  validations: [],
  hidden: false,
  enabled: true,
  validate: false,
};

ComponentStore.registerComponent('freeTextAutoComplete', FreeTextAutoComplete);
