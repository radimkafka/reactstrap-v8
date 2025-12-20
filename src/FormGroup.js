import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  children: PropTypes.node,
  row: PropTypes.bool,
  check: PropTypes.bool,
  inline: PropTypes.bool,
  disabled: PropTypes.bool,
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const FormGroup = (props) => {
  const {
    className,
    cssModule,
    row,
    disabled,
    check,
    inline,
    tag: Tag = 'div',
    ...attributes
  } = props;

  const classes = mapToCssModules(classNames(
    className,
    row ? 'row' : false,
    check ? 'form-check' : 'form-group',
    check && inline ? 'form-check-inline' : false,
    check && disabled ? 'disabled' : false
  ), cssModule);
  
  if (Tag === 'fieldset') {
    attributes.disabled = disabled;
  }

  return (
    <Tag {...attributes} className={classes} />
  );
};

FormGroup.propTypes = propTypes;

export default FormGroup;
