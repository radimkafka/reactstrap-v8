import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const ModalBody = (props) => {
  const {
    className,
    cssModule,
    tag: Tag = 'div',
    ...attributes } = props;
  const classes = mapToCssModules(classNames(
    className,
    'modal-body'
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} />
  );
};

ModalBody.propTypes = propTypes;

export default ModalBody;
