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

const BreadcrumbItem = (props) => {
  const {
    className,
    cssModule,
    active,
    tag: Tag = 'li',
    ...attributes
  } = props;
  const classes = mapToCssModules(classNames(
    className,
    active ? 'active' : false,
    'breadcrumb-item'
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} aria-current={active ? 'page' : undefined} />
  );
};

BreadcrumbItem.propTypes = propTypes;

export default BreadcrumbItem;
