import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const CardTitle = (props) => {
  const {
    className,
    cssModule,
    tag: Tag = 'div',
    ...attributes
  } = props;
  const classes = mapToCssModules(classNames(
    className,
    'card-title'
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} />
  );
};

CardTitle.propTypes = propTypes;

export default CardTitle;
