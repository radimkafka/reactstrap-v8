import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import { CarouselContext } from './CarouselContext';
import { mapToCssModules, TransitionTimeouts, TransitionStatuses, tagPropType } from './utils';

class CarouselItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startAnimation: false,
    };

    this.nodeRef = createRef();

    this.onEnter = this.onEnter.bind(this);
    this.onEntering = this.onEntering.bind(this);
    this.onExit = this.onExit.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onEnter(isAppearing) {
    const node = this.nodeRef.current;
    this.setState({ startAnimation: false });
    this.props.onEnter(node, isAppearing);
  }

  onEntering(isAppearing) {
    const node = this.nodeRef.current;
    // getting this variable triggers a reflow
    const offsetHeight = node.offsetHeight;
    this.setState({ startAnimation: true });
    this.props.onEntering(node, isAppearing);
    return offsetHeight;
  }

  onExit() {
    const node = this.nodeRef.current;
    this.setState({ startAnimation: false });
    this.props.onExit(node);
  }

  onExiting() {
    const node = this.nodeRef.current;
    this.setState({ startAnimation: true });
    node.dispatchEvent(new CustomEvent('slide.bs.carousel'));
    this.props.onExiting(node);
  }

  onExited() {
    const node = this.nodeRef.current;
    node.dispatchEvent(new CustomEvent('slid.bs.carousel'));
    this.props.onExited(node);
  }

  render() {
    const { in: isIn, children, cssModule, slide, tag: Tag, className, ...transitionProps } = this.props;

    return (
      <Transition
        {...transitionProps}
        nodeRef={this.nodeRef}
        enter={slide}
        exit={slide}
        in={isIn}
        onEnter={this.onEnter}
        onEntering={this.onEntering}
        onExit={this.onExit}
        onExiting={this.onExiting}
        onExited={this.onExited}
      >
        {(status) => (
          <CarouselContext.Consumer>
            {({ direction }) => {
              const isActive = (status === TransitionStatuses.ENTERED) || (status === TransitionStatuses.EXITING);
              const directionClassName = (status === TransitionStatuses.ENTERING || status === TransitionStatuses.EXITING) &&
                this.state.startAnimation &&
                (direction === 'right' ? 'carousel-item-left' : 'carousel-item-right');
              const orderClassName = (status === TransitionStatuses.ENTERING) &&
                (direction === 'right' ? 'carousel-item-next' : 'carousel-item-prev');
              const itemClasses = mapToCssModules(classNames(
                className,
                'carousel-item',
                isActive && 'active',
                directionClassName,
                orderClassName,
              ), cssModule);

              return (
                <Tag ref={this.nodeRef} className={itemClasses}>
                  {children}
                </Tag>
              );
            }}
          </CarouselContext.Consumer>
        )}
      </Transition>
    );
  }
}

CarouselItem.propTypes = {
  ...Transition.propTypes,
  tag: tagPropType,
  in: PropTypes.bool,
  cssModule: PropTypes.object,
  children: PropTypes.node,
  slide: PropTypes.bool,
  className: PropTypes.string,
};

CarouselItem.defaultProps = {
  ...Transition.defaultProps,
  tag: 'div',
  timeout: TransitionTimeouts.Carousel,
  slide: true,
};

export default CarouselItem;
