import * as React from 'react';
import { Boundary, Placement } from '@popperjs/core';
import { PopperModifiers } from './DropdownMenu';
import { CSSModule } from './index';

interface PopoverChildrenRenderProps {
  scheduleUpdate: () => void;
}

export type PopoverChildren =
  | ((props: PopoverChildrenRenderProps) => React.ReactNode)
  | React.ReactNode;

export interface PopoverProps extends React.HTMLAttributes<HTMLElement> {
  [key: string]: any;
  isOpen?: boolean;
  toggle?: React.MouseEventHandler<any> | (() => void);
  target: string | HTMLElement | React.RefObject<HTMLElement>;
  container?: string | HTMLElement | React.RefObject<HTMLElement>;
  boundariesElement?: Boundary | Element | string;
  placement?: Placement;
  popperClassName?: string;
  innerClassName?: string;
  disabled?: boolean;
  hideArrow?: boolean;
  placementPrefix?: string;
  delay?: number | { show: number; hide: number };
  modifiers?: PopperModifiers;
  positionFixed?: boolean;
  cssModule?: CSSModule;
  fade?: boolean;
  flip?: boolean;
  children?: PopoverChildren;
}

export interface UncontrolledPopoverProps extends PopoverProps {
  defaultOpen?: boolean;
}

declare class Popover extends React.Component<PopoverProps> {}
export default Popover;
