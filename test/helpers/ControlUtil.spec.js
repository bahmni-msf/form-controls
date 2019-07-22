import {
  isAnyAncestorOrControlHasAddMore,
  getCurrentFormFieldPathIfAddMore, getLastControlIdFromFormFieldPath,
} from 'src/helpers/ControlUtil';
import { expect } from 'chai';

describe('ControlUtil', () => {
  describe('isAnyAncestorOrControlHasAddMore', () => {
    it('should return true when parentFormFieldPath exists', () => {
      const control = {};
      const result = isAnyAncestorOrControlHasAddMore(control, 'Form.1/1-0');
      expect(result).to.eql(true);
    });

    it('should return true when parentFormFieldPath is empty and' +
        'control has addMore property with value true', () => {
      const control = {
        properties: {
          addMore: true,
        },
      };
      const result = isAnyAncestorOrControlHasAddMore(control, '');
      expect(result).to.eql(true);
    });

    it('should return false when parentFormFieldPath is empty and' +
          'control has addMore property with value false', () => {
      const control = {
        properties: {
          addMore: false,
        },
      };
      const result = isAnyAncestorOrControlHasAddMore(control, '');
      expect(result).to.eql(false);
    });
  });

  describe('getCurrentFormFieldPathIfAddMore', () => {
    it('should return formFieldPath when parentFormFieldPath is not empty', () => {
      const control = {
        id: 2,
      };
      const result = getCurrentFormFieldPathIfAddMore('', '', control, 'Form.1/1-0');
      expect(result).to.eql('Form.1/1-0/2-0');
    });

    it('should return formFieldPath when parentFormFieldPath is empty and control' +
        'has addMore property is true', () => {
      const control = {
        id: 2,
        properties: {
          addMore: true,
        },
      };
      const result = getCurrentFormFieldPathIfAddMore('Form', '1', control, '');
      expect(result).to.eql('Form.1/2-0');
    });

    it('should return empty formFieldPath when parentFormFieldPath is empty and control' +
          'has addMore property is false', () => {
      const control = {
        id: 2,
        properties: {
          addMore: false,
        },
      };
      const result = getCurrentFormFieldPathIfAddMore('Form', '1', control, '');
      expect(result).to.eql('');
    });

    describe('getLastControlIdFromFormFieldPath', () => {
      it('should return last control id for a given form field path', () => {
        expect('4').to.eql(getLastControlIdFromFormFieldPath('TestForm.1/1-0/3-1/4-3'));
      });

      it('should return -1 if given form field path is undefined', () => {
        expect(-1).to.eql(getLastControlIdFromFormFieldPath());
      });
    });
  });
});
