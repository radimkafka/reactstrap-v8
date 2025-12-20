import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const CardText = (props) => {
  const {
    className,
    cssModule,
    tag: Tag = 'p',
    ...attributes
  } = props;
  const classes = mapToCssModules(classNames(
    className,
    'card-text'
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} />
  );
};

CardText.propTypes = propTypes;

export default CardText;
