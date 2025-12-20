import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  listClassName: PropTypes.string,
  cssModule: PropTypes.object,
  size: PropTypes.string,
  tag: tagPropType,
  listTag: tagPropType,
  'aria-label': PropTypes.string
};

const Pagination = (props) => {
  const {
    className,
    listClassName,
    cssModule,
    size,
    tag: Tag = 'nav',
    listTag: ListTag = 'ul',
    'aria-label': label = 'pagination',
    ...attributes
  } = props;

  const classes = mapToCssModules(classNames(
    className
  ), cssModule);

  const listClasses = mapToCssModules(classNames(
    listClassName,
    'pagination',
    {
      [`pagination-${size}`]: !!size,
    }
  ), cssModule);

  return (
    <Tag className={classes} aria-label={label}>
      <ListTag {...attributes} className={listClasses} />
    </Tag>
  );
};

Pagination.propTypes = propTypes;

export default Pagination;
