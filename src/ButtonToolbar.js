import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  'aria-label': PropTypes.string,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  role: PropTypes.string,
};

const ButtonToolbar = (props) => {
  const {
    className,
    cssModule,
    tag: Tag = 'div',
    role = 'toolbar',
    ...attributes
  } = props;

  const classes = mapToCssModules(classNames(
    className,
    'btn-toolbar'
  ), cssModule);

  return (
    <Tag {...attributes} role={role} className={classes} />
  );
};

ButtonToolbar.propTypes = propTypes;

export default ButtonToolbar;
