import * as React from 'react';

type SignalCallback = (value: unknown) => void;
type PublishContext = (value: unknown) => void;
type SubscribeContext = (callback: SignalCallback) => () => void;

class Signal {
  hasValue: boolean;
  callbacks: Set<SignalCallback>;
  value: unknown;

  constructor() {
    this.hasValue = false;
    this.callbacks = new Set();
  }

  publish(value: unknown) {
    this.hasValue = true;
    this.value = value;
    this.callbacks.forEach((callback) => {
      callback(value);
    });
  }

  subscribe(callback: SignalCallback) {
    this.callbacks.add(callback);
    if (this.hasValue) {
      callback(this.value);
    }

    return () => {
      this.callbacks.delete(callback);
    };
  }
}

export function createSignal() {
  const SignalPublishContext = React.createContext<PublishContext>(
    () => undefined
  );
  const SignalSubscribeContext = React.createContext<SubscribeContext>(
    () => () => undefined
  );

  function SignalProvider({ children }: { children: React.ReactNode }) {
    const signalRef = React.useRef(new Signal());
    const publish = React.useCallback((value: unknown) => {
      signalRef.current.publish(value);
    }, []);

    const subscribe = React.useCallback((callback: SignalCallback) => {
      const unsubscribe = signalRef.current.subscribe(callback);
      return () => unsubscribe();
    }, []);

    return (
      <SignalPublishContext.Provider value={publish}>
        <SignalSubscribeContext.Provider value={subscribe}>
          {children}
        </SignalSubscribeContext.Provider>
      </SignalPublishContext.Provider>
    );
  }

  function usePublish() {
    return React.useContext(SignalPublishContext);
  }

  function useSignalSubscription(callback: SignalCallback) {
    const subscribe = React.useContext(SignalSubscribeContext);
    const callbackRef = React.useRef(callback);

    React.useEffect(() => {
      callbackRef.current = callback;
    });

    React.useEffect(() => {
      const unsubscribe = subscribe((value: unknown) => {
        callbackRef.current(value);
      });

      return () => unsubscribe();
    }, [subscribe]);
  }

  return {
    Provider: SignalProvider,
    usePublish,
    useSubscription: useSignalSubscription,
  };
}
