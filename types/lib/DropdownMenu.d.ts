import * as React from 'react';
import { StrictModifiers } from '@popperjs/core';
import { CSSModule } from './index';

export type PopperModifiers =
  | ReadonlyArray<Partial<StrictModifiers>>
  | { [key: string]: any };

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLElement> {
  [key: string]: any;
  tag?: React.ElementType;
  right?: boolean;
  flip?: boolean;
  modifiers?: PopperModifiers;
  cssModule?: CSSModule;
  persist?: boolean;
  positionFixed?: boolean;
  container?: string | HTMLElement | React.RefObject<HTMLElement>;
}

declare class DropdownMenu extends React.Component<DropdownMenuProps> {}
export default DropdownMenu;
