import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tabs: PropTypes.bool,
  pills: PropTypes.bool,
  vertical: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  horizontal: PropTypes.string,
  justified: PropTypes.bool,
  fill: PropTypes.bool,
  navbar: PropTypes.bool,
  card: PropTypes.bool,
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const getVerticalClass = (vertical) => {
  if (vertical === false) {
    return false;
  } else if (vertical === true || vertical === 'xs') {
    return 'flex-column';
  }

  return `flex-${vertical}-column`;
};

const Nav = ({
  className,
  cssModule,
  tabs,
  pills,
  vertical = false,
  horizontal,
  justified,
  fill,
  navbar,
  card,
  tag: Tag = 'ul',
  ...attributes
}) => {

  const classes = mapToCssModules(classNames(
    className,
    navbar ? 'navbar-nav' : 'nav',
    horizontal ? `justify-content-${horizontal}` : false,
    getVerticalClass(vertical),
    {
      'nav-tabs': tabs,
      'card-header-tabs': card && tabs,
      'nav-pills': pills,
      'card-header-pills': card && pills,
      'nav-justified': justified,
      'nav-fill': fill,
    }
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} />
  );
};

Nav.propTypes = propTypes;

export default Nav;
