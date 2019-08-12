import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TimeDesigner } from 'components/designer/Time.jsx';

chai.use(chaiEnzyme());

describe.only('TimeDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Follow up Date',
        uuid: 'someUuid',
        dataType: 'Date',
      },
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
    wrapper = shallow(<TimeDesigner metadata={metadata} />);
  });

  it('should render the Time designer component', () => {
    expect(wrapper).to.have.descendants('input');
    expect(wrapper.find('input')).to.have.prop('type').to.eql('time');
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });
});
