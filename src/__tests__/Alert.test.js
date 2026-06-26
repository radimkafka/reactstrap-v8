import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '../';

// RTL replica of Alert.spec.js (Enzyme). The Enzyme suite inspects the inner
// <Transition> element's props (timeout/appear/enter/exit) directly; those are
// implementation details RTL can't see, so the transition-config tests below
// assert the user-observable result (the alert renders inside the fade wrapper)
// instead.
describe('Alert', () => {
  it('should render children', () => {
    render(<Alert>Yo!</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Yo!');
  });

  it('should pass className down', () => {
    render(<Alert className="test-class-name">Yo!</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('test-class-name');
  });

  it('should pass close className down', () => {
    function noop() {}
    render(<Alert toggle={noop} closeClassName="test-class-name">Yo!</Alert>);
    expect(screen.getByRole('button')).toHaveClass('close', 'test-class-name');
  });

  it('should pass other props down', () => {
    render(<Alert data-testprop="testvalue">Yo!</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('data-testprop', 'testvalue');
  });

  it('should have default transitionTimeouts', () => {
    // Enzyme asserted Transition timeout=150/appear/enter/exit. The observable
    // equivalent: the alert renders wrapped by the default fade transition.
    render(<Alert>Yo!</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('fade');
  });

  it('should have support configurable transitionTimeouts', () => {
    // Custom transition config (timeout 0, no appear/enter/exit) still renders
    // the alert; the timeout values themselves aren't observable in the DOM.
    render(
      <Alert transition={{ timeout: 0, appear: false, enter: false, exit: false }}>
        Yo!
      </Alert>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should have "success" as default color', () => {
    render(<Alert>Yo!</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('alert-success');
  });

  it('should accept color prop', () => {
    render(<Alert color="warning">Yo!</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('alert-warning');
  });

  it('should use a div tag by default', () => {
    render(<Alert>Yo!</Alert>);
    expect(screen.getByRole('alert').tagName).toBe('DIV');
  });

  it('should be non dismissible by default', () => {
    render(<Alert>Yo!</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).not.toHaveClass('alert-dismissible');
  });

  it('should show dismiss button if passed toggle', () => {
    render(<Alert color="danger" toggle={() => {}}>Yo!</Alert>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('alert-dismissible');
  });

  it('should support custom tag', () => {
    render(<Alert tag="p">Yo!</Alert>);
    expect(screen.getByRole('alert').tagName).toBe('P');
  });

  it('should be empty if not isOpen', () => {
    const { container } = render(<Alert isOpen={false}>Yo!</Alert>);
    expect(container).toBeEmptyDOMElement();
  });

  it('should be dismissible', () => {
    const onClick = jest.fn();
    render(<Alert color="danger" toggle={onClick}>Yo!</Alert>);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should render close button with custom aria-label', () => {
    render(<Alert toggle={() => {}} closeAriaLabel="oseclay">Yo!</Alert>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'oseclay');
  });
});
