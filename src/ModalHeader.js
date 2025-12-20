import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  wrapTag: tagPropType,
  toggle: PropTypes.func,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  children: PropTypes.node,
  closeAriaLabel: PropTypes.string,
  charCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  close: PropTypes.object,
};

const ModalHeader = (props) => {
  let closeButton;
  const {
    className,
    cssModule,
    children,
    toggle,
    tag: Tag = 'h5',
    wrapTag: WrapTag = 'div',
    closeAriaLabel = 'Close',
    charCode = 215,
    close,
    ...attributes } = props;

  const classes = mapToCssModules(classNames(
    className,
    'modal-header'
  ), cssModule);

  if (!close && toggle) {
    const closeIcon = typeof charCode === 'number' ? String.fromCharCode(charCode) : charCode;
    closeButton = (
      <button type="button" onClick={toggle} className={mapToCssModules('close', cssModule)} aria-label={closeAriaLabel}>
        <span aria-hidden="true">{closeIcon}</span>
      </button>
    );
  }

  return (
    <WrapTag {...attributes} className={classes}>
      <Tag className={mapToCssModules('modal-title', cssModule)}>
        {children}
      </Tag>
      {close || closeButton}
    </WrapTag>
  );
};

ModalHeader.propTypes = propTypes;

export default ModalHeader;
