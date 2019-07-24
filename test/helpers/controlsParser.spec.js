import { expect } from 'chai';
import { groupControlsByLocation, sortGroupedControls,
  getControlFromId } from 'src/helpers/controlsParser';
import { setupAddRemoveButtonsForAddMore } from 'src/helpers/controlsParser';
import { ControlRecord } from 'src/ControlState';

describe('ControlsParser', () => {
  function getControl(row, column) {
    const control = {
      type: 'someType',
      id: 'someId',
      properties: { location: { row, column } },
    };
    return control;
  }

  let controls;
  let control1;
  let control2;
  let control3;
  let control4;
  let control5;
  before(() => {
    control1 = getControl(1, 0);
    control2 = getControl(1, 1);
    control3 = getControl(0, 0);
    control4 = getControl(0, 2);
    control5 = getControl(2, 0);
    controls = [control1, control2, control3, control4, control5];
  });

  describe('groupControlsByLocation', () => {
    it('should return the controls grouped by rows', () => {
      const groupedControls = groupControlsByLocation(controls, 'row');
      const expectedControls = { 1: [control1, control2], 0: [control3, control4], 2: [control5] };
      expect(groupedControls).to.deep.eql(expectedControls);
    });

    it('should return the controls grouped by columns', () => {
      const groupedControls = groupControlsByLocation(controls, 'column');
      const expectedControls = { 0: [control1, control3, control5], 1: [control2], 2: [control4] };
      expect(groupedControls).to.deep.eql(expectedControls);
    });
  });

  describe('sortGroupedControls', () => {
    it('should return the grouped controls sorted in ascending order', () => {
      const groupedControls = groupControlsByLocation(controls, 'row');
      const sortedRows = sortGroupedControls(groupedControls);
      const expectedControls = [[control3, control4], [control1, control2], [control5]];
      expect(sortedRows.length).to.eql(3);
      expect(sortedRows).to.deep.eql(expectedControls);
    });
  });

  describe('setupAddRemoveButtonsForAddMore', () => {
    it('should properly set showAddMore and showRemove properties', () => {
      const controlRecords = [new ControlRecord(), new ControlRecord(), new ControlRecord()];
      const modifiedRecords = setupAddRemoveButtonsForAddMore(controlRecords);

      expect(modifiedRecords[0].showAddMore).to.eql(false);
      expect(modifiedRecords[0].showRemove).to.eql(false);

      expect(modifiedRecords[1].showAddMore).to.eql(false);
      expect(modifiedRecords[1].showRemove).to.eql(true);

      expect(modifiedRecords[2].showAddMore).to.eql(true);
      expect(modifiedRecords[2].showRemove).to.eql(true);
    });
  });

  describe('getControlFromId', () => {
    it('should return undefined if control is undefined', () => {
      expect(undefined).to.eql(getControlFromId(2));
    });

    it('should return undefined if controlId and control are undefined', () => {
      expect(undefined).to.eql(getControlFromId());
    });

    it('should return control if controlId is same for passed in control', () => {
      const control = {
        id: 1,
      };
      const actualControl = getControlFromId(1, control);
      expect(1).to.eql(actualControl.id);
    });

    it('should return undefined if control is empty', () => {
      const actualControl = getControlFromId(2, {});
      expect(undefined).to.eql(actualControl);
    });

    it('should return immediate section control from root', () => {
      const control = {
        name: 'form',
        controls: [
          {
            name: 'Section',
            id: 1,
          },
        ],
      };

      const actualControl = getControlFromId(1, control);
      expect(1).to.eql(actualControl.id);
    });

    it('should return second section control from root which has two section controls',
      () => {
        const control = {
          name: 'form',
          controls: [
            {
              name: 'Section',
              id: 1,
            },
            {
              name: 'Section',
              id: 2,
            },
          ],
        };

        const actualControl = getControlFromId(2, control);
        expect(2).to.eql(actualControl.id);
      });

    it('should return the inner section control from root which has section inside a section',
      () => {
        const control = {
          name: 'form',
          controls: [
            {
              name: 'Section',
              id: 1,
              controls: [
                {
                  type: 'obsControl',
                  id: 9,
                },
              ],
            },
          ],
        };

        const actualControl = getControlFromId(9, control);
        expect(9).to.eql(actualControl.id);
      });

    it('should return section control which is present two levels deep from root and the last' +
      'one in that level ',
      () => {
        const control = {
          name: 'form',
          controls: [
            {
              name: 'Section',
              id: 1,
              controls: [
                {
                  type: 'section2',
                  id: 9,
                  controls: [
                    {
                      type: 'section3',
                      id: 10,
                    },
                    {
                      type: 'section4',
                      id: 12,
                    },
                  ],
                },
              ],
            },
            {
              name: 'Section',
              id: 11,
            },
          ],
        };

        const actualControl = getControlFromId(12, control);
        expect(12).to.eql(actualControl.id);
      });
  });
});
