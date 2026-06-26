/* global jest */
import util from 'util';
import Enzyme from 'enzyme';
import { act } from 'react-dom/test-utils';
import Adapter from '@cfaester/enzyme-adapter-react-18';
// Custom jest-dom matchers (toHaveClass, toBeInTheDocument, ...) for the RTL
// (`*.test.js`) suites. Harmless for the Enzyme (`*.spec.js`) suites, which
// share this setup file. RTL itself auto-registers an afterEach cleanup() when
// it detects this jest environment, so portals/renders are torn down per test.
import '@testing-library/jest-dom';

Enzyme.configure({ adapter: new Adapter() });

// react-dom/server (used by Enzyme's static render / wrapper.html()) requires
// TextEncoder/TextDecoder in the global scope. The old jsdom bundled with
// react-scripts 2.1.1 does not provide them, so polyfill from Node's `util`.
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = util.TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = util.TextDecoder;
}

global.requestAnimationFrame = function (cb) { cb(0); };
global.window.cancelAnimationFrame = function () { };
global.createSpyObj = (baseName, methodNames) => {
  const obj = {};

  for (let i = 0; i < methodNames.length; i += 1) {
    obj[methodNames[i]] = jest.fn();
  }

  return obj;
};
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {}
});

// The old jsdom bundled with react-scripts@2.1.1 dispatches `focus`/`blur` on
// `.focus()`/`.blur()` but not the *bubbling* `focusin`/`focusout` events.
// React 16 delegated onFocus/onBlur by listening for `focus`/`blur` at the
// document (capture), so it worked; React 17+ delegate via the bubbling
// `focusin`/`focusout` at the root container instead. Without those events,
// programmatic focus moves the element (document.activeElement updates) but the
// React onFocus/onBlur handlers never fire. Emit the bubbling variants so focus
// behaves as it does in a real browser. Only fired when focus actually moves,
// matching native semantics (non-focusable elements emit nothing).
['focus', 'blur'].forEach((method) => {
  const bubbleType = method === 'focus' ? 'focusin' : 'focusout';
  const original = global.HTMLElement.prototype[method];
  // Patch only once: HTMLElement.prototype is shared across test files in this
  // runner, so re-wrapping each file would stack layers that each dispatch the
  // bubbling event, firing onFocus/onBlur multiple times per `.focus()` call.
  if (original.__focusPatched) return;
  const patched = function patchedFocus(...args) {
    // Use the element's own document and guard against it being null (React 18
    // can run commit-phase focus() calls in windows where the global document
    // reference is momentarily unavailable).
    const doc = this.ownerDocument;
    const before = doc && doc.activeElement;
    original.apply(this, args);
    // Only synthesize the bubbling event when focus actually changed and jsdom
    // didn't already emit it for us.
    if (doc && doc.activeElement !== before) {
      this.dispatchEvent(new global.Event(bubbleType, { bubbles: true, cancelable: false }));
    }
  };
  patched.__focusPatched = true;
  global.HTMLElement.prototype[method] = patched;
});

// React 18's adapter renders via the async `createRoot` API. These specs were
// written for React 16's synchronous mode and rarely await the adapter's
// internal act() flush, so Popper/portal/timer components can leave a pending
// concurrent commit queued. When jsdom tears the environment down between
// files, that queued commit fires against a null `document` and throws an
// uncaught "Cannot read properties of null (reading 'body')". Draining pending
// React work + microtasks after every test (while `document` is still alive)
// flushes those commits so nothing is left to crash at teardown.
/* global afterEach */
afterEach(async () => {
  await act(async () => {
    await Promise.resolve();
  });
});

