import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import { mapToCssModules, omit, pick, TransitionPropTypeKeys, TransitionTimeouts, tagPropType } from './utils';

const propTypes = {
  ...Transition.propTypes,
  // Override timeout to not be required since we provide a default
  timeout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      enter: PropTypes.number,
      exit: PropTypes.number,
      appear: PropTypes.number,
    }),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  tag: tagPropType,
  baseClass: PropTypes.string,
  baseClassActive: PropTypes.string,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  innerRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.func,
  ]),
};

// Exported for other components to reference (e.g., Alert)
export const fadeDefaultProps = {
  ...Transition.defaultProps,
  tag: 'div',
  baseClass: 'fade',
  baseClassActive: 'show',
  timeout: TransitionTimeouts.Fade,
  appear: true,
  enter: true,
  exit: true,
  in: true,
};

function Fade(props) {
  const {
    tag: Tag = 'div',
    baseClass = 'fade',
    baseClassActive = 'show',
    className,
    cssModule,
    children,
    innerRef,
    ...otherProps
  } = props;

  // Set defaults for transition props, filtering out undefined values
  const pickedProps = pick(otherProps, TransitionPropTypeKeys);
  const filteredProps = Object.fromEntries(
    Object.entries(pickedProps).filter(([, v]) => v !== undefined)
  );
  const transitionPropsWithDefaults = {
    timeout: TransitionTimeouts.Fade,
    appear: true,
    enter: true,
    exit: true,
    in: true,
    ...filteredProps,
  };
  const childProps = omit(otherProps, TransitionPropTypeKeys);

  return (
    <Transition {...transitionPropsWithDefaults}>
      {(status) => {
        const isActive = status === 'entered';
        const classes = mapToCssModules(classNames(
          className,
          baseClass,
          isActive && baseClassActive
        ), cssModule);
        return (
          <Tag className={classes} {...childProps} ref={innerRef}>
            {children}
          </Tag>
        );
      }}
    </Transition>
  );
}

Fade.propTypes = propTypes;

export default Fade;
