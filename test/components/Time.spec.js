import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Time } from 'src/components/Time.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import { Error } from 'src/Error';

chai.use(chaiEnzyme());

describe('Time', () => {
  let onChangeSpy;

  beforeEach(() => {
    onChangeSpy = sinon.spy();
  });

  it('should render Time', () => {
    const wrapper = shallow(
            <Time
              formFieldPath="test1.1/1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={[]}
            />
        );
    expect(wrapper).to.have.descendants('input');
    expect(wrapper.find('input').props().type).to.eql('time');
  });

  it('should render Time with default value', () => {
    const wrapper = shallow(
            <Time
              formFieldPath="test1.1/1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={[]}
              value={'03:04:00 AM'}
            />
        );
    expect(wrapper.find('input').props().value).to.be.eql('03:04:00 AM');
  });

  it('should get user entered value of the time', () => {
    const wrapper = shallow(
            <Time
              formFieldPath="test1.1/1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={[]}
              value={'03:04:00 AM'}
            />
        );
    wrapper.find('input').simulate('change', { target: { value: '03:04:00 AM' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: '03:04:00 AM', errors: [] }));
  });

  it('should return undefined when value is undefined', () => {
    const wrapper = shallow(
            <Time
              formFieldPath="test1.1/1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={[]}
            />
        );
    wrapper.find('input').simulate('change', { target: { value: undefined } });

    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: undefined, errors: [] }));
  });

  it('should return undefined when value is empty string', () => {
    const wrapper = shallow(
            <Time
              formFieldPath="test1.1/1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={[]}
            />
        );
    wrapper.find('input').simulate('change', { target: { value: '' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: undefined, errors: [] }));
  });

  it('should throw error on fail of validations', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = shallow(
            <Time
              formFieldPath="test1.1/1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={validations}
              value={'03:04:00 AM'}
            />
        );
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.find('input').simulate('change', { target: { value: undefined } });
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: undefined, errors: [mandatoryError] }));
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should throw error on fail of validations during component update', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
            <Time
              formFieldPath="test1.1/1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={validations}
              value={'03:04:00 AM'}
            />
        );
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.setProps({ validate: true, value: undefined });
    sinon.assert.called(onChangeSpy.withArgs({ value: undefined, errors: [mandatoryError] }));
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should check errors after mount if the formFieldPath suffix is not 0', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
            <Time
              formFieldPath="test1.1/1-1"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={validations}
            />
        );

    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should not check errors after mount if the formFieldPath suffix is 0', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
            <Time
              formFieldPath="test1.1/1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={validations}
              value={'03:04:00 AM'}
            />
        );

    expect(wrapper.find('input')).to.not.have.className('form-builder-error');
  });

  it('should render Time on change of props', () => {
    const wrapper = shallow(
            <Time
              formFieldPath="test1.1/1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={[]}
              value={'03:04:00 AM'}
            />
        );
    wrapper.setProps({ value: '03:04:00 AM' });
    expect(wrapper.find('input').props().value).to.be.eql('03:04:00 AM');
  });

  it('should show as disabled when time is set to be disabled', () => {
    const wrapper = shallow(
            <Time
              enabled={false}
              formFieldPath="test1.1/1-0"
              onChange={() => {}}
              validate={false}
              validateForm={false}
              validations={[]}
            />
        );

    expect(wrapper.find('input').props().disabled).to.eql(true);
  });

  it('should show as enabled when time is set to be enabled', () => {
    const wrapper = shallow(
            <Time
              enabled
              formFieldPath="test1.1/1-0"
              onChange={() => {}}
              validate={false}
              validateForm={false}
              validations={[]}
            />
        );

    expect(wrapper.find('input').props().disabled).to.eql(false);
  });
  it('should trigger onChange when mounting component and the value is not undefined', () => {
    const wrapper = mount(
            <Time
              enabled
              formFieldPath="test1.1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={[]}
              value={'03:04:00 AM'}
            />
        );
    wrapper.instance();
    sinon.assert.calledOnce(onChangeSpy);
  });

  it('should trigger onChange when the value is changed', () => {
    const wrapper = mount(
            <Time
              formFieldPath="test1.1-0"
              onChange={onChangeSpy}
              validate={false}
              validateForm={false}
              validations={[]}
            />
        );

    wrapper.setProps({ value: '03:04:00 AM' });
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: '03:04:00 AM', errors: [] }));
  });
});
