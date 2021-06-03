import Constants from 'src/constants';
import isEmpty from 'lodash/isEmpty';

export function getKeyPrefixForControl(formName, formVersion, controlId, parentFormFieldPath) {

  if (!isEmpty(parentFormFieldPath)) {
    parentFormFieldPath = validateFormFieldPath(parentFormFieldPath);
  }
  const formFieldPath = isEmpty(parentFormFieldPath) ? `${formName}.${formVersion}/${controlId}`
      : `${parentFormFieldPath}/${controlId}`;
  return {
    formNamespace: `${Constants.bahmni}`,
    formFieldPath,
  };
}
function validateFormFieldPath(formFieldPath) {
  const path = formFieldPath.split('/');
  let lastItem;
  if (path && path.length > 1) { lastItem = path.pop();}
  if (!/\d+-\d+/.test(lastItem)) {
    return undefined;
  } return formFieldPath;
}

export function createFormNamespaceAndPath(formName, formVersion, controlId, parentFormFieldPath) {
  const formNamespaceAndPath = getKeyPrefixForControl(formName,
      formVersion, controlId, parentFormFieldPath);
  formNamespaceAndPath.formFieldPath += '-0';
  return formNamespaceAndPath;
}

export function getUpdatedFormFieldPath(sourceNode, parentFormFieldPath) {
  if (isEmpty(parentFormFieldPath)) {
    return sourceNode.formFieldPath;
  }
  const sourceFormFieldPath = sourceNode.formFieldPath;
  const lastIndex = sourceFormFieldPath.lastIndexOf('/');
  return parentFormFieldPath + sourceFormFieldPath.substring(lastIndex, sourceFormFieldPath.length);
}
