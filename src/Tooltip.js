import React from 'react';
import classNames from 'classnames';
import TooltipPopoverWrapper, { propTypes } from './TooltipPopoverWrapper';

const Tooltip = (props) => {
  const {
    placement = 'top',
    autohide = true,
    placementPrefix = 'bs-tooltip',
    trigger = 'hover focus',
    popperClassName,
    innerClassName,
    ...rest
  } = props;

  const popperClasses = classNames(
    'tooltip',
    'show',
    popperClassName
  );

  const classes = classNames(
    'tooltip-inner',
    innerClassName
  );


  return (
    <TooltipPopoverWrapper
      {...rest}
      placement={placement}
      autohide={autohide}
      placementPrefix={placementPrefix}
      trigger={trigger}
      popperClassName={popperClasses}
      innerClassName={classes}
    />
  );
};

Tooltip.propTypes = propTypes;


export default Tooltip;
