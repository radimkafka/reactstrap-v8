import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  type: PropTypes.string,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  children: PropTypes.node,
};

const NavbarToggler = ({
  className,
  cssModule,
  children,
  tag: Tag = 'button',
  type = 'button',
  ...attributes
}) => {

  const classes = mapToCssModules(classNames(
    className,
    'navbar-toggler'
  ), cssModule);

  return (
    <Tag aria-label="Toggle navigation" {...attributes} className={classes}>
      {children || <span className={mapToCssModules('navbar-toggler-icon', cssModule)} />}
    </Tag>
  );
};

NavbarToggler.propTypes = propTypes;

export default NavbarToggler;
