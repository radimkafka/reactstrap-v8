import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Carousel } from '../';
import CarouselItem from '../CarouselItem';
import CarouselIndicators from '../CarouselIndicators';
import CarouselControl from '../CarouselControl';
import CarouselCaption from '../CarouselCaption';
import { CarouselContext } from '../CarouselContext';

// RTL replica of Carousel.spec.js (Enzyme). Two translation notes:
//  * Enzyme reads Carousel's internal state (state().direction,
//    state().indicatorClicked). Those have no RTL equivalent, so they are
//    asserted through their DOM manifestation: an entering slide gets the
//    `carousel-item-next` class when direction is "right" and
//    `carousel-item-prev` when direction is "left".
//  * The three CarouselItem "transitions" specs fail under Enzyme because its
//    synchronous tree doesn't reflect the post-transition commit. Here we drive
//    the transition with fake timers wrapped in act() and read the committed
//    DOM, which lets them pass.
describe('Carousel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const items = [
    { src: '', altText: 'a', caption: 'caption 1' },
    { src: '', altText: 'b', caption: 'caption 2' },
    { src: '', altText: 'c', caption: 'caption 3' },
  ];

  const makeSlides = () =>
    items.map((item, idx) => (
      <CarouselItem key={idx}>
        <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
      </CarouselItem>
    ));

  describe('captions', () => {
    it('should render a header and a caption', () => {
      const { container } = render(<CarouselCaption captionHeader="abc" captionText="def" />);
      expect(container.querySelectorAll('h3')).toHaveLength(1);
      expect(container.querySelectorAll('p')).toHaveLength(1);
    });
  });

  describe('items', () => {
    it('should render custom tag', () => {
      const { container } = render(<CarouselItem tag="img" />);
      expect(container.querySelectorAll('img')).toHaveLength(1);
    });

    it('should render an image if one is passed in', () => {
      const { container } = render(
        <CarouselItem>
          <img src={items[0].src} alt={items[0].src} />
        </CarouselItem>
      );
      expect(container.querySelectorAll('img')).toHaveLength(1);
    });

    it('should render a caption if one is passed in', () => {
      const { container } = render(
        <CarouselItem>
          <CarouselCaption captionHeader="text" captionText="text" />
        </CarouselItem>
      );
      expect(container.querySelector('.carousel-caption')).toBeInTheDocument();
    });

    describe('transitions', () => {
      // Re-render through the same CarouselContext.Provider so the consumer in
      // CarouselItem keeps reading the test's direction.
      const renderItem = (direction, props) => {
        const ui = (inProp) => (
          <CarouselContext.Provider value={{ direction }}>
            <CarouselItem in={inProp} {...props} />
          </CarouselContext.Provider>
        );
        const utils = render(ui(false));
        return { ...utils, setIn: (inProp) => utils.rerender(ui(inProp)) };
      };

      it('should add the appropriate classes when entering right', () => {
        const { container, setIn } = renderItem('right');

        act(() => setIn(true));
        expect(container.firstChild.className).toBe('carousel-item carousel-item-left carousel-item-next');

        act(() => jest.advanceTimersByTime(600));
        expect(container.firstChild.className).toBe('carousel-item active');

        act(() => setIn(false));
        expect(container.firstChild.className).toBe('carousel-item active carousel-item-left');

        act(() => jest.advanceTimersByTime(600));
        expect(container.firstChild.className).toBe('carousel-item');
      });

      it('should add the appropriate classes when entering left', () => {
        const { container, setIn } = renderItem('left');

        act(() => setIn(true));
        expect(container.firstChild.className).toBe('carousel-item carousel-item-right carousel-item-prev');

        act(() => jest.advanceTimersByTime(600));
        expect(container.firstChild.className).toBe('carousel-item active');

        act(() => setIn(false));
        expect(container.firstChild.className).toBe('carousel-item active carousel-item-right');

        act(() => jest.advanceTimersByTime(600));
        expect(container.firstChild.className).toBe('carousel-item');
      });

      it('should call all callbacks when transitioning in and out', () => {
        const callbacks = {
          onEnter: jest.fn(),
          onEntering: jest.fn(),
          onEntered: jest.fn(),
          onExit: jest.fn(),
          onExiting: jest.fn(),
          onExited: jest.fn(),
        };
        const { setIn } = renderItem('right', callbacks);

        act(() => setIn(true));
        expect(callbacks.onEnter).toHaveBeenCalled();
        expect(callbacks.onEntering).toHaveBeenCalled();
        expect(callbacks.onEntered).not.toHaveBeenCalled();

        act(() => jest.advanceTimersByTime(600));
        expect(callbacks.onEntered).toHaveBeenCalled();
        expect(callbacks.onExit).not.toHaveBeenCalled();

        act(() => setIn(false));
        expect(callbacks.onExit).toHaveBeenCalled();
        expect(callbacks.onExiting).toHaveBeenCalled();
        expect(callbacks.onExited).not.toHaveBeenCalled();

        act(() => jest.advanceTimersByTime(600));
        expect(callbacks.onExited).toHaveBeenCalled();
      });
    });
  });

  describe('indicators', () => {
    it('should render a list with the right number of items', () => {
      const { container } = render(
        <CarouselIndicators items={items} activeIndex={0} onClickHandler={() => {}} />
      );
      expect(container.querySelectorAll('ol')).toHaveLength(1);
      expect(container.querySelectorAll('li')).toHaveLength(3);
    });

    it('should append the correct active class', () => {
      const { container } = render(
        <CarouselIndicators items={items} activeIndex={0} onClickHandler={() => {}} />
      );
      expect(container.querySelectorAll('.active')).toHaveLength(1);
    });

    it('should call the click handler', () => {
      const onClick = jest.fn();
      const { container } = render(
        <CarouselIndicators items={items} activeIndex={0} onClickHandler={onClick} />
      );
      fireEvent.click(container.querySelector('li'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('controls', () => {
    it('should render an anchor tag', () => {
      const { container } = render(<CarouselControl direction="next" onClickHandler={() => {}} />);
      expect(container.querySelectorAll('a')).toHaveLength(1);
    });

    it('should call the onClickHandler', () => {
      const onClick = jest.fn();
      const { container } = render(<CarouselControl direction="next" onClickHandler={onClick} />);
      fireEvent.click(container.querySelector('a'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('rendering', () => {
    it('should show the carousel indicators', () => {
      const { container } = render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          <CarouselIndicators items={items} activeIndex={0} onClickHandler={() => {}} />
          {makeSlides()}
        </Carousel>
      );
      expect(container.querySelector('.carousel-indicators')).toBeInTheDocument();
    });

    it('should show controls', () => {
      const { container } = render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          {makeSlides()}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={() => {}} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={() => {}} />
        </Carousel>
      );
      expect(container.querySelectorAll('.carousel-control-prev, .carousel-control-next')).toHaveLength(2);
    });

    it('should show a single slide', () => {
      const { container } = render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          {makeSlides()}
        </Carousel>
      );
      expect(container.querySelectorAll('.carousel-item.active')).toHaveLength(1);
    });

    it('should show indicators and controls', () => {
      const { container } = render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          <CarouselIndicators items={items} activeIndex={0} onClickHandler={() => {}} />
          {makeSlides()}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={() => {}} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={() => {}} />
        </Carousel>
      );
      expect(container.querySelectorAll('.carousel-control-prev, .carousel-control-next')).toHaveLength(2);
      expect(container.querySelector('.carousel-indicators')).toBeInTheDocument();
    });

    it('should tolerate booleans, null and undefined values rendered as children of Carousel', () => {
      const { container } = render(
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          {null}
          {true}
          {false}
          {undefined}
          {(() => {})()}
          <CarouselIndicators items={items} activeIndex={0} onClickHandler={() => {}} />
          {makeSlides()}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={() => {}} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={() => {}} />
        </Carousel>
      );
      expect(container.querySelectorAll('.carousel-control-prev, .carousel-control-next')).toHaveLength(2);
      expect(container.querySelector('.carousel-indicators')).toBeInTheDocument();
    });
  });

  describe('carouseling', () => {
    // Renders a controlled Carousel and exposes a setActiveIndex() that
    // re-renders with a new activeIndex (mirrors enzyme's setProps).
    const renderCarousel = (initialIndex, withIndicators = false) => {
      const ui = (activeIndex) => (
        <Carousel interval={1000} activeIndex={activeIndex} next={() => {}} previous={() => {}}>
          {withIndicators ? (
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={() => {}} />
          ) : null}
          {makeSlides()}
        </Carousel>
      );
      const utils = render(ui(initialIndex));
      return { ...utils, setActiveIndex: (i) => act(() => utils.rerender(ui(i))) };
    };

    it('should set indicatorClicked to true if indicator clicked', () => {
      // indicatorClicked is internal; its observable effect is that clicking an
      // indicator invokes the supplied onClickHandler (Carousel wraps it).
      const onClick = jest.fn();
      const ui = (
        <Carousel activeIndex={0} next={() => {}} previous={() => {}}>
          <CarouselIndicators items={items} activeIndex={0} onClickHandler={onClick} />
          {makeSlides()}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={() => {}} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={() => {}} />
        </Carousel>
      );
      const { container } = render(ui);
      act(() => {
        fireEvent.click(container.querySelector('.carousel-indicators li'));
      });
      expect(onClick).toHaveBeenCalled();
    });

    it('should go right when the index increases', () => {
      const { container, setActiveIndex } = renderCarousel(0);
      setActiveIndex(1);
      // direction "right" => entering slide carries the "next" order class.
      expect(container.querySelector('.carousel-item-next')).toBeInTheDocument();
    });

    it('should go left when the index decreases', () => {
      const { container, setActiveIndex } = renderCarousel(1);
      setActiveIndex(0);
      expect(container.querySelector('.carousel-item-prev')).toBeInTheDocument();
    });

    it('should go right if transitioning from the last to first slide by non-indicator', () => {
      const { container, setActiveIndex } = renderCarousel(2);
      setActiveIndex(0);
      expect(container.querySelector('.carousel-item-next')).toBeInTheDocument();
    });

    it('should go left if transitioning from the first to last slide by non-indicator', () => {
      const { container, setActiveIndex } = renderCarousel(0);
      setActiveIndex(2);
      expect(container.querySelector('.carousel-item-prev')).toBeInTheDocument();
    });

    it('should go left if transitioning from the last to first slide by indicator', () => {
      const { container, setActiveIndex } = renderCarousel(2, true);
      // Clicking an indicator sets indicatorClicked = true.
      act(() => {
        fireEvent.click(container.querySelector('.carousel-indicators li'));
      });
      setActiveIndex(0);
      expect(container.querySelector('.carousel-item-prev')).toBeInTheDocument();
    });

    it('should go right if transitioning from the first to last slide by indicator', () => {
      const { container, setActiveIndex } = renderCarousel(0, true);
      act(() => {
        fireEvent.click(container.querySelector('.carousel-indicators li'));
      });
      setActiveIndex(2);
      expect(container.querySelector('.carousel-item-next')).toBeInTheDocument();
    });
  });

  describe('interval', () => {
    const renderRide = (props) =>
      render(
        <Carousel previous={() => {}} activeIndex={0} {...props}>
          {makeSlides()}
        </Carousel>
      );

    it('should not autoplay by default', () => {
      const next = jest.fn();
      renderRide({ next, interval: 1000 });
      act(() => jest.advanceTimersByTime(1000));
      expect(next).not.toHaveBeenCalled();
    });

    it('should autoplay when ride is carousel', () => {
      const next = jest.fn();
      renderRide({ next, interval: 1000, ride: 'carousel' });
      act(() => jest.advanceTimersByTime(1000));
      expect(next).toHaveBeenCalled();
    });

    it('should accept a number', () => {
      const next = jest.fn();
      renderRide({ next, interval: 1000, ride: 'carousel' });
      act(() => jest.advanceTimersByTime(1000));
      expect(next).toHaveBeenCalled();
    });

    it('should accept a boolean', () => {
      const next = jest.fn();
      renderRide({ next, interval: false });
      act(() => jest.advanceTimersByTime(5000));
      expect(next).not.toHaveBeenCalled();
    });

    it('should default to 5000', () => {
      const next = jest.fn();
      renderRide({ next, ride: 'carousel' });
      act(() => jest.advanceTimersByTime(5000));
      expect(next).toHaveBeenCalled();
    });

    it('it should accept a string', () => {
      const next = jest.fn();
      renderRide({ next, interval: '1000', ride: 'carousel' });
      act(() => jest.advanceTimersByTime(1000));
      expect(next).toHaveBeenCalled();
    });
  });
});
