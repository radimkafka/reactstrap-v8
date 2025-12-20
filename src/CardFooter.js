import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const CardFooter = (props) => {
  const {
    className,
    cssModule,
    tag: Tag = 'div',
    ...attributes
  } = props;
  const classes = mapToCssModules(classNames(
    className,
    'card-footer'
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} />
  );
};

CardFooter.propTypes = propTypes;

export default CardFooter;
