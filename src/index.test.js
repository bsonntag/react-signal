import React from 'react';
import { render } from '@testing-library/react';
import { createSignal } from '.';

describe('createSignal', () => {
  it('should publish a new value to the signal', () => {
    const Signal = createSignal('foo');
    const callback = jest.fn();

    function TestSubscriber() {
      Signal.useSubscription(callback);
      return null;
    }

    function TestPublisher() {
      const publish = Signal.usePublish();
      React.useEffect(() => publish('foo'), [publish]);
      return null;
    }

    render(
      <Signal.Provider>
        <TestPublisher />
        <TestSubscriber />
      </Signal.Provider>
    );

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('foo');
  });
});
