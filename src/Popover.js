import React from 'react';
import classNames from 'classnames';
import TooltipPopoverWrapper, { propTypes } from './TooltipPopoverWrapper';

const Popover = (props) => {
  const {
    placement = 'right',
    placementPrefix = 'bs-popover',
    trigger = 'click',
    popperClassName,
    innerClassName,
    ...rest
  } = props;

  const popperClasses = classNames(
    'popover',
    'show',
    popperClassName
  );

  const classes = classNames(
    'popover-inner',
    innerClassName
  );


  return (
    <TooltipPopoverWrapper
      {...rest}
      placement={placement}
      placementPrefix={placementPrefix}
      trigger={trigger}
      popperClassName={popperClasses}
      innerClassName={classes}
    />
  );
};

Popover.propTypes = propTypes;


export default Popover;
