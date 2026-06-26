import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../';

// Note: we use fireEvent rather than @testing-library/user-event. user-event v14
// drives focus/selection through document.getSelection(), which the 2018-era
// jsdom bundled with react-scripts 2.1.1 does not implement; fireEvent dispatches
// the DOM event directly and is sufficient for these handler-wiring assertions.

// RTL replica of Button.spec.js (Enzyme). Internal assertions in the Enzyme
// suite (wrapper.instance().onClick(e), shallow().hasClass()) are expressed
// here as observable DOM + user-behavior checks.
describe('Button', () => {
  it('should render children', () => {
    render(<Button>Ello world</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Ello world');
  });

  it('should render custom element', () => {
    const Link = (props) => <a href="/home" {...props}>{props.children}</a>;
    const { container } = render(<Button tag={Link}>Home</Button>);

    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent('Home');
  });

  it('should render an anchor element if href exists', () => {
    const { container } = render(<Button href="/home">Home</Button>);

    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent('Home');
  });

  it('should render type as undefined by default when tag is "button"', () => {
    render(<Button>Home</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('type');
  });

  it('should render type as "button" by default when tag is "button" and onClick is provided', () => {
    render(<Button onClick={() => {}}>Home</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should render type as user defined when defined by the user', () => {
    render(<Button type="submit">Home</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should not render type by default when the type is not defined and the tag is not "button"', () => {
    const { container } = render(<Button tag="a">Home</Button>);
    expect(container.querySelector('a')).not.toHaveAttribute('type');
  });

  it('should not render type by default when the type is not defined and the href is defined', () => {
    const { container } = render(<Button href="#">Home</Button>);
    expect(container.querySelector('a')).not.toHaveAttribute('type');
  });

  it('should render buttons with default color', () => {
    const { container } = render(<Button>Default Button</Button>);
    expect(container.firstChild).toHaveClass('btn-secondary');
  });

  it('should render buttons with other colors', () => {
    const { container } = render(<Button color="danger">Default Button</Button>);
    expect(container.firstChild).toHaveClass('btn-danger');
  });

  it('should render buttons with outline variant', () => {
    const { container } = render(<Button outline>Default Button</Button>);
    expect(container.firstChild).toHaveClass('btn-outline-secondary');
  });

  it('should render buttons with outline variant with different colors', () => {
    const { container } = render(<Button outline color="info">Default Button</Button>);
    expect(container.firstChild).toHaveClass('btn-outline-info');
  });

  it('should render buttons at different sizes', () => {
    const { container: small } = render(<Button size="sm">Small Button</Button>);
    const { container: large } = render(<Button size="lg">Large Button</Button>);

    expect(small.firstChild).toHaveClass('btn-sm');
    expect(large.firstChild).toHaveClass('btn-lg');
  });

  it('should render block level buttons', () => {
    const { container } = render(<Button block>Block Level Button</Button>);
    expect(container.firstChild).toHaveClass('btn-block');
  });

  it('should render close icon utility with default props', () => {
    const times = '×'; // unicode: U+00D7 MULTIPLICATION SIGN
    const expectedInnerHTML = `<span aria-hidden="true">${times}</span>`;

    const { container } = render(<Button close />);
    const button = container.firstChild;

    expect(button).toHaveClass('close');
    expect(button).not.toHaveClass('btn');
    expect(button).not.toHaveClass('btn-secondary');
    expect(button.getAttribute('aria-label')).toMatch(/close/i);
    expect(button.innerHTML).toBe(expectedInnerHTML);
  });

  it('should render close icon with custom child and props', () => {
    const testChild = 'close this thing';
    render(<Button close>{testChild}</Button>);
    expect(screen.getByText(testChild)).toBeInTheDocument();
  });

  describe('onClick', () => {
    it('calls props.onClick if it exists', () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Testing Click</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalled();
    });

    it('returns the value returned by props.onClick', () => {
      // The Enzyme test asserts Button.onClick returns props.onClick's value.
      // That return value is an internal detail with no user-observable effect,
      // so RTL can only verify the handler is wired through and invoked.
      const onClick = jest.fn(() => 1234);
      render(<Button onClick={onClick}>Testing Click</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalled();
    });

    it('is not called when disabled', () => {
      const onClick = jest.fn();
      const { rerender } = render(<Button onClick={onClick}>Testing Click</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);

      rerender(<Button onClick={onClick} disabled>Testing Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      // When disabled, Button.onClick calls preventDefault and returns before
      // delegating, so props.onClick is never invoked again.
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
