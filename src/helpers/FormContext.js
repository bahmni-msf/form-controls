import ControlRecordWrapper from './ControlRecordWrapper';

export default class FormContext {

  constructor(formRecords, patient, parentRecord) {
    this.wrapper = new ControlRecordWrapper(formRecords);
    this.rootRecord = formRecords;
    this.patient = patient;
    this.parentRecord = parentRecord;
  }

  getName(recordTree) {
    return recordTree.getConceptName() || recordTree.getLabelName();
  }

  getId(recordTree) {
    return recordTree.getControlId();
  }

  find(recordTree, name) {
    let records = [];
    if (this.getName(recordTree) === name) {
      records.push(recordTree);
    }
    if (recordTree.children) {
      recordTree.children.forEach(r => {
        const filteredRecords = this.find(r, name);
        records = records.concat(filteredRecords);
      });
    }
    return records;
  }

  get(name, index = 0) {
    const currentRecord = this.find(this.rootRecord, name)[index];
    if (!currentRecord) {
      const message = `name[${name}] and position[${index}]`;
      /* eslint-disable */
      console.warn(`[FormEventHandler] Control with ${message} is not exist`);
    }
    return this.wrapper.set(currentRecord);
  }

  getAll(name) {
    const records = this.find(this.parentRecord, name);
      if (!records) {
          const message = `name[${name}]`;
          /* eslint-disable */
          console.warn(`[FormEventHandler] Control with ${message} is not exist`);
      }
      // return records.map(record => new ControlRecordWrapper(this.rootRecord).set(record))
      return records.map(record => this.wrapper.set(record))

  }

  findById(recordTree, id) {
    let records = [];
    const controlId = this.getId(recordTree);
    if (controlId && parseInt(controlId) === id) {
      records.push(recordTree);
    }
    if (recordTree.children) {
      recordTree.children.forEach(r => {
        const filteredRecords = this.findById(r, id);
        records = records.concat(filteredRecords);
      });
    }
    return records;
  }

  getPatient() {
    return this.patient;
  }

  getById(id) {
    const currentRecord = this.findById(this.rootRecord, id)[0];
    if (!currentRecord) {
      const message = `id - ${id}`;
      /* eslint-disable */
      console.warn(`[FormEventHandler] Control with ${message} does not exist`);
    }
    return this.wrapper.set(currentRecord);
  }

  getRecords() {
    return this.wrapper.getRecords();
  }

}
