import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  active: PropTypes.bool,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const NavItem = ({
  className,
  cssModule,
  active,
  tag: Tag = 'li',
  ...attributes
}) => {

  const classes = mapToCssModules(classNames(
    className,
    'nav-item',
    active ? 'active' : false
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} />
  );
};

NavItem.propTypes = propTypes;

export default NavItem;
