import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object
};

const ListInlineItem = forwardRef((props, ref) => {
  const {
    className,
    cssModule,
    tag: Tag = 'li',
    ...attributes
  } = props;
  const classes = mapToCssModules(classNames(
    className,
    'list-inline-item'
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} ref={ref} />
  );
});

ListInlineItem.propTypes = propTypes;

export default ListInlineItem;
