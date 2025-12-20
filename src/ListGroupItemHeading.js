import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  className: PropTypes.any,
  cssModule: PropTypes.object,
};

const ListGroupItemHeading = (props) => {
  const {
    className,
    cssModule,
    tag: Tag = 'h5',
    ...attributes
  } = props;
  const classes = mapToCssModules(classNames(
    className,
    'list-group-item-heading'
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} />
  );
};

ListGroupItemHeading.propTypes = propTypes;

export default ListGroupItemHeading;
