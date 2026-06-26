import React from 'react';
import { render } from '@testing-library/react';
import { Badge } from '../';

// RTL replica of Badge.spec.js (Enzyme). Enzyme's shallow().type()/hasClass()
// assertions become DOM-level checks on the rendered element.
describe('Badge', () => {
  it('should render a span by default', () => {
    const { container } = render(<Badge>Yo!</Badge>);
    expect(container.firstChild.tagName).toBe('SPAN');
  });

  it('should render an anchor when href is provided', () => {
    const { container } = render(<Badge href="#">Yo!</Badge>);
    expect(container.firstChild.tagName).toBe('A');
  });

  it('should render a custom tag when provided', () => {
    const { container } = render(<Badge tag="main">Yo!</Badge>);
    expect(container.firstChild.tagName).toBe('MAIN');
  });

  it('should render children', () => {
    const { container } = render(<Badge>Yo!</Badge>);
    expect(container.firstChild).toHaveTextContent('Yo!');
  });

  it('should render badges with secondary color', () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    expect(container.firstChild).toHaveClass('badge-secondary');
  });

  it('should render Badges with other colors', () => {
    const { container } = render(<Badge color="danger">Danger Badge</Badge>);
    expect(container.firstChild).toHaveClass('badge-danger');
  });

  it('should render Badges as pills', () => {
    const { container } = render(<Badge pill>Pill Badge</Badge>);
    expect(container.firstChild).toHaveClass('badge-pill');
  });
});
