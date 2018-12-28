import { List } from 'immutable';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ControlRecordTreeBuilder from 'src/helpers/ControlRecordTreeBuilder';
import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder';
import { ObsList } from 'src/helpers/ObsList';
chai.use(chaiEnzyme());

describe('ControlRecordTreeBuilder', () => {
  it('should filter inactive record from nest record tree', () => {
    const obsGroupConcept = {
      datatype: 'N/A',
      name: 'TestGroup',
      set: true,
      setMembers: [
        {
          answers: [],
          datatype: 'Numeric',
          description: [],
          hiAbsolute: null,
          hiNormal: null,
          lowAbsolute: null,
          lowNormal: null,
          name: 'TestObs',
          properties: {
            allowDecimal: false,
          },
          units: null,
          uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
        },
      ],
      uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
    };
    const obsConcept = {
      answers: [],
      datatype: 'Numeric',
      description: [],
      hiAbsolute: null,
      hiNormal: null,
      lowAbsolute: null,
      lowNormal: null,
      name: 'TestObs',
      properties: {
        allowDecimal: false,
      },
      units: null,
      uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
    };
    const activeFormFieldPath = 'SingleGroup.3/4-0';
    const obsRecord = new ControlRecord({
      control: {
        concept: obsConcept,
        hiAbsolute: null,
        hiNormal: null,
        id: '4',
        label: {
          type: 'label',
          value: 'TestObs',
        },
        lowAbsolute: null,
        lowNormal: null,
        properties: {
          addMore: true,
          hideLabel: false,
          location: {
            column: 0,
            row: 0,
          },
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
        units: null,
      },
      formFieldPath: activeFormFieldPath,
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: 'SingleGroup.3/4-0',
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const inactiveObsRecord = new ControlRecord({
      control: {
        concept: obsConcept,
        hiAbsolute: null,
        hiNormal: null,
        id: '4',
        label: {
          type: 'label',
          value: 'TestObs',
        },
        lowAbsolute: null,
        lowNormal: null,
        properties: {
          addMore: true,
          hideLabel: false,
          location: {
            column: 0,
            row: 0,
          },
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
        units: null,
      },
      formFieldPath: 'SingleGroup.3/4-1',
      value: {},
      active: false,
      dataSource: {
        concept: obsConcept,
        formFieldPath: 'SingleGroup.3/4-0',
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const obsGroupRecord = new ControlRecord({
      control: {
        concept: obsGroupConcept,
        controls: [
          {
            concept: obsConcept,
            hiAbsolute: null,
            hiNormal: null,
            id: '4',
            label: {
              type: 'label',
              value: 'TestObs',
            },
            lowAbsolute: null,
            lowNormal: null,
            properties: {
              addMore: true,
              hideLabel: false,
              location: {
                column: 0,
                row: 0,
              },
              mandatory: false,
              notes: false,
            },
            type: 'obsControl',
            units: null,
          },
        ],
        id: '3',
        label: {
          type: 'label',
          value: 'TestGroup',
        },
        properties: {
          abnormal: false,
          addMore: true,
          location: {
            column: 0,
            row: 0,
          },
        },
        type: 'obsGroupControl',
      },
      formFieldPath: 'SingleGroup.3/3-0',
      children: List.of(obsRecord, inactiveObsRecord),
      value: {},
      active: true,
      dataSource: {
        concept: obsGroupConcept,
        formFieldPath: 'SingleGroup.3/3-0',
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const rootRecordTree = new ControlRecord({ children: List.of(obsGroupRecord) });

    const activeRecordTree = rootRecordTree.getActive();

    const obsGroupRecordTree = activeRecordTree.children.get(0);
    expect(obsGroupRecordTree.children.size).to.equal(1);
    const activeObsRecordTree = obsGroupRecordTree.children.get(0);
    expect(activeObsRecordTree.formFieldPath).to.equal(activeFormFieldPath);
    expect(activeObsRecordTree.active).to.equal(true);
  });

  it('should get inactive record form inactive observation', () => {
    const obsConcept = {
      answers: [],
      datatype: 'Numeric',
      description: [],
      name: 'Pulse',
      properties: {
        allowDecimal: true,
      },
      uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
    };
    const activeFormFieldPath = 'SingleObs.1/1-0';
    const inactiveFormFieldPath = 'SingleObs.1/1-1';
    const observations = [
      {
        concept: obsConcept,
        formFieldPath: activeFormFieldPath,
        formNamespace: 'Bahmni',
        inactive: false,
        voided: true,
      },
      {
        concept: obsConcept,
        formFieldPath: inactiveFormFieldPath,
        formNamespace: 'Bahmni',
        inactive: true,
        voided: true,
      },
    ];
    const metadata = {
      controls: [
        {
          concept: obsConcept,
          hiAbsolute: null,
          hiNormal: 72,
          id: '1',
          label: {
            type: 'label',
            value: 'Pulse(/min)',
          },
          lowAbsolute: null,
          lowNormal: 72,
          properties: {
            addMore: true,
            hideLabel: false,
            location: {
              column: 0,
              row: 0,
            },
            mandatory: true,
            notes: false,
          },
          type: 'obsControl',
          units: '/min',
        },
      ],
      id: 209,
      name: 'SingleObs',
      uuid: '245940b7-3d6b-4a8b-806b-3f56444129ae',
      version: '1',
    };

    const rootRecordTree = new ControlRecordTreeBuilder().build(metadata, observations);

    const activeRecord = rootRecordTree.children.get(0);
    expect(activeRecord.formFieldPath).to.equal(activeFormFieldPath);
    expect(activeRecord.active).to.equal(true);
    const inactiveRecord = rootRecordTree.children.get(1);
    expect(inactiveRecord.formFieldPath).to.equal(inactiveFormFieldPath);
    expect(inactiveRecord.active).to.equal(false);
  });

  it('should get record tree with events script when given metadata with events scripts', () => {
    const booleanObsConcept = {
      answers: [],
      datatype: 'Boolean',
      description: [],
      name: 'Tuberculosis, Need of Admission',
      properties: {
        allowDecimal: null,
      },
      uuid: 'c5cdd4e5-86e0-400c-9742-d73ffb323fa8',
    };
    const textBoxConcept = {
      answers: [],
      datatype: 'Text',
      description: [],
      name: 'Chief Complaint Notes',
      properties: {
        allowDecimal: null,
      },
      uuid: 'c398a4be-3f10-11e4-adec-0800271c1b75',
    };
    const events = { onValueChange: 'function(form){}' };
    const metadata = {
      controls: [
        {
          concept: booleanObsConcept,
          events,
          hiAbsolute: null,
          hiNormal: null,
          id: '5',
          label: {
            type: 'label',
            value: 'Tuberculosis, Need of Admission',
          },
          lowAbsolute: null,
          lowNormal: null,
          options: [
            {
              name: 'Yes',
              value: true,
            },
            {
              name: 'No',
              value: false,
            },
          ],
          properties: {
            addMore: false,
            hideLabel: false,
            location: {
              column: 0,
              row: 0,
            },
            mandatory: false,
            notes: false,
          },
          type: 'obsControl',
          units: null,
        },
        {
          concept: textBoxConcept,
          hiAbsolute: null,
          hiNormal: null,
          id: '2',
          label: {
            type: 'label',
            value: 'Chief Complaint Notes',
          },
          lowAbsolute: null,
          lowNormal: null,
          properties: {
            addMore: false,
            hideLabel: false,
            location: {
              column: 0,
              row: 1,
            },
            mandatory: false,
            notes: false,
          },
          type: 'obsControl',
          units: null,
        },
      ],
      id: 4,
      name: '3129',
      uuid: '940980e6-74e6-4f09-993d-60ddf42eb0e9',
      version: '3',
    };

    const obsRecordTree = new ControlRecordTreeBuilder().build(metadata, []);

    expect(obsRecordTree.children.get(0).control.concept.name).to.equal(booleanObsConcept.name);
    expect(obsRecordTree.children.get(0).control.events).to.equal(events);
  });

  it('should get concept name from the record tree when the root has concept', () => {
    const conceptName = 'Smoking History';
    const concept = {
      name: conceptName,
    };
    const obsRecordTree = new ControlRecord({
      control: {
        concept,
      },
    });
    expect(obsRecordTree.getConceptName()).to.equal(conceptName);
  });

  it('should get undefined from the record tree when the root does not have concept', () => {
    const labelName = 'something';
    const obsRecordTree = new ControlRecord({
      control: {
        value: labelName,
      },
    });
    expect(obsRecordTree.getConceptName()).to.equal(undefined);
  });

  it('should get undefined for concept name when given root doesn\'t have control', () => {
    const obsRecordTree = new ControlRecord({});
    expect(obsRecordTree.getConceptName()).to.equal(undefined);
  });

  it('should get undefined for label name when given root doesn\'t have control', () => {
    const obsRecordTree = new ControlRecord({});
    expect(obsRecordTree.getLabelName()).to.equal(undefined);
  });

  it('should get label name from the record tree when the root has label', () => {
    const labelName = 'something';
    const obsRecordTree = new ControlRecord({
      control: {
        value: labelName,
      },
    });
    expect(obsRecordTree.getLabelName()).to.equal(labelName);
  });

  it('should get control id from the record tree', () => {
    const labelName = 'something';
    const obsRecordTree = new ControlRecord({
      control: {
        value: labelName,
        id: '1',
      },
    });
    expect(obsRecordTree.getControlId()).to.equal('1');
  });

  it('should return control id as undefined from the record tree if there is no control', () => {
    const obsRecordTree = new ControlRecord({ value: '100' });
    expect(obsRecordTree.getControlId()).to.equal(undefined);
  });

  it('should not get mandatory error when the record is hidden', () => {
    const errors = {
      type: 'error',
      message: 'mandatory',
    };
    const obsRecordTree = new ControlRecord({
      control: {
        errors,
        hidden: true,
      },
    });
    expect(obsRecordTree.getErrors().length).to.equals(0);
  });
  it('should not get mandatory error when the record is disabled', () => {
    const errors = {
      type: 'error',
      message: 'mandatory',
    };
    const obsRecordTree = new ControlRecord({
      control: {
        errors,
        enabled: false,
      },
    });
    expect(obsRecordTree.getErrors().length).to.equals(0);
  });

  it('should return empty array when the record does not have key error', () => {
    const obsRecordTree = new ControlRecord({
      control: {
      },
    });
    expect(obsRecordTree.getErrors().length).to.equals(0);
  });

  it('should return the new tree after removing the control which does not contain any other' +
    ' child and matches the form field path', () => {
    const obsConcept = {
      answers: [],
      datatype: 'Numeric',
      description: [],
      hiAbsolute: null,
      hiNormal: null,
      lowAbsolute: null,
      lowNormal: null,
      name: 'TestObs',
      properties: {
        allowDecimal: false,
      },
      units: null,
      uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
    };
    const formFieldPath1 = 'SingleGroup.1/1-0';
    const formFieldPath2 = 'SingleGroup.1/2-0';
    const control = {
      concept: obsConcept,
      hiAbsolute: null,
      hiNormal: null,
      id: '4',
      label: {
        type: 'label',
        value: 'TestObs',
      },
      lowAbsolute: null,
      lowNormal: null,
      properties: {
        addMore: true,
        hideLabel: false,
        location: {
          column: 0,
          row: 0,
        },
        mandatory: false,
        notes: false,
      },
      type: 'obsControl',
      units: null,
    };
    const controlRecord1 = new ControlRecord({
      control,
      formFieldPath: formFieldPath1,
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: formFieldPath1,
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const controlRecord2 = new ControlRecord({
      control,
      formFieldPath: formFieldPath2,
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: formFieldPath2,
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const rootRecordTree = new ControlRecord({ children: List.of(controlRecord1, controlRecord2) });
    const updatedRecordTree = rootRecordTree.remove(formFieldPath1);
    expect(updatedRecordTree.children.size).to.equal(1);
  });


  it('should return the new tree by removing a nested child that matches the form field' +
    ' path', () => {
    const obsConcept = {
      answers: [],
      datatype: 'Numeric',
      description: [],
      hiAbsolute: null,
      hiNormal: null,
      lowAbsolute: null,
      lowNormal: null,
      name: 'TestObs',
      properties: {
        allowDecimal: false,
      },
      units: null,
      uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
    };
    const formFieldPath1 = 'SingleGroup.1/1-0';
    const formFieldPath1of1 = 'SingleGroup.1/1-0/1-0';
    const formFieldPath2of1 = 'SingleGroup.1/1-0/1-1';
    const formFieldPath2 = 'SingleGroup.1/2-0';
    const control = {
      concept: obsConcept,
      hiAbsolute: null,
      hiNormal: null,
      id: '4',
      label: {
        type: 'label',
        value: 'TestObs',
      },
      lowAbsolute: null,
      lowNormal: null,
      properties: {
        addMore: true,
        hideLabel: false,
        location: {
          column: 0,
          row: 0,
        },
        mandatory: false,
        notes: false,
      },
      type: 'obsControl',
      units: null,
    };
    const controlRecord1of1 = new ControlRecord({
      control,
      formFieldPath: formFieldPath1of1,
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: formFieldPath1of1,
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const controlRecord2of1 = new ControlRecord({
      control,
      formFieldPath: formFieldPath2of1,
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: formFieldPath2of1,
        formNamespace: 'Bahmni',
        voided: true,
      },
    });

    const controlRecord1 = new ControlRecord({ children: List.of(controlRecord1of1,
        controlRecord2of1), formFieldPath: formFieldPath1 });
    const controlRecord2 = new ControlRecord({
      control,
      formFieldPath: formFieldPath2,
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: formFieldPath2,
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const rootRecordTree = new ControlRecord({ children: List.of(controlRecord1, controlRecord2) });
    const updatedRecordTree = rootRecordTree.remove(formFieldPath1of1);
    expect(updatedRecordTree.children.size).to.equal(2);
    expect(updatedRecordTree.children.get(0).children.size).to.equal(1);
  });

  it.only('should make the child record datasoruce obslist uuid to ' +
      'undefined when 2 level hierarchy present', () => {
    const obsConcept = {
      answers: [],
      datatype: 'Numeric',
      description: [],
      hiAbsolute: null,
      hiNormal: null,
      lowAbsolute: null,
      lowNormal: null,
      name: 'TestObs',
      properties: {
        allowDecimal: false,
      },
      units: null,
      uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
    };
    const control = {
      concept: obsConcept,
      hiAbsolute: null,
      hiNormal: null,
      id: '4',
      label: {
        type: 'label',
        value: 'TestObs',
      },
      lowAbsolute: null,
      lowNormal: null,
      properties: {
        addMore: true,
        hideLabel: false,
        location: {
          column: 0,
          row: 0,
        },
        mandatory: false,
        notes: false,
      },
      type: 'obsControl',
      units: null,
    };

    const obsRecordTreeOne = new ControlRecord({
      control,
      formFieldPath: 'AddMoreForm.3/2-0/1-0/1-0',
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: 'AddMoreForm.3/2-0/1-0/1-0',
        formNamespace: 'Bahmni',
        voided: true,
        obsList: List.of({
          uuid: 'uuid1',
        }),
      },
    });

    const obsRecordTreeTwo = new ControlRecord({
      control,
      formFieldPath: 'AddMoreForm.3/2-0/1-0/2-0',
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: 'AddMoreForm.3/2-0/1-0/2-0',
        formNamespace: 'Bahmni',
        voided: true,
        obsList: List.of({
          uuid: 'uuid2',
        }),
      },
    });
    const sectionRecordTree = new ControlRecord({ children: List.of(obsRecordTreeOne, obsRecordTreeTwo),
      formFieldPath: 'AddMoreForm.3/2-0/1-0' });
    let rootSectionRecordTree = new ControlRecord({ children: List.of(sectionRecordTree),
      formFieldPath: 'AddMoreForm.3/2-0' });

    expect(rootSectionRecordTree.children.get(0).children.get(0).dataSource.obsList.get(0).uuid).to.equal('uuid1');
    expect(rootSectionRecordTree.children.get(0).children.get(1).dataSource.obsList.get(0).uuid).to.equal('uuid2');
    rootSectionRecordTree = rootSectionRecordTree.voidChildRecordUuids();
    expect(rootSectionRecordTree.children.get(0).children.get(0).dataSource.uuid).to.equal(undefined);
    expect(rootSectionRecordTree.children.get(0).children.get(1).dataSource.uuid).to.equal(undefined);
  });

  it('should make the child record datasoruce obslist uuid to ' +
      'undefined when 1 level hierarchy present', () => {
    const obsConcept = {
      answers: [],
      datatype: 'Numeric',
      description: [],
      hiAbsolute: null,
      hiNormal: null,
      lowAbsolute: null,
      lowNormal: null,
      name: 'TestObs',
      properties: {
        allowDecimal: false,
      },
      units: null,
      uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
    };
    const control = {
      concept: obsConcept,
      hiAbsolute: null,
      hiNormal: null,
      id: '4',
      label: {
        type: 'label',
        value: 'TestObs',
      },
      lowAbsolute: null,
      lowNormal: null,
      properties: {
        addMore: true,
        hideLabel: false,
        location: {
          column: 0,
          row: 0,
        },
        mandatory: false,
        notes: false,
      },
      type: 'obsControl',
      units: null,
    };

    const obsRecordTree = new ControlRecord({
      control,
      formFieldPath: 'AddMoreForm.3/2-0/1-0',
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: 'AddMoreForm.3/2-0/1-0',
        formNamespace: 'Bahmni',
        voided: true,
        obsList: List.of({
          uuid: 'uuid',
        }),
      },
    });
    let sectionRecordTree = new ControlRecord({ children: List.of(obsRecordTree),
      formFieldPath: 'AddMoreForm.3/2-0' });
    console.log(JSON.stringify(sectionRecordTree));
    expect(sectionRecordTree.children.get(0).dataSource.obsList.get(0).uuid).to.equal('uuid');
    sectionRecordTree = sectionRecordTree.voidChildRecordUuids();
    console.log(JSON.stringify(sectionRecordTree.children.get(0)));
    expect(sectionRecordTree.children.get(0).dataSource.uuid).to.equal(undefined);
  });
});
