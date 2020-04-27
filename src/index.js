import * as React from 'react';

class Signal {
  constructor() {
    this.hasValue = false;
    this.callbacks = new Set();
  }

  publish(value) {
    this.hasValue = true;
    this.value = value;
    this.callbacks.forEach((callback) => {
      callback(value);
    });
  }

  subscribe(callback) {
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
  const SignalPublishContext = React.createContext();
  const SignalSubscribeContext = React.createContext();

  function SignalProvider({ children }) {
    const signalRef = React.useRef(new Signal());
    const publish = React.useCallback((value) => {
      signalRef.current.publish(value);
    }, []);
    const subscribe = React.useCallback((callback) => {
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

  function useSignalSubscription(callback) {
    const subscribe = React.useContext(SignalSubscribeContext);
    const callbackRef = React.useRef(callback);

    React.useEffect(() => {
      callbackRef.current = callback;
    });

    React.useEffect(() => {
      const unsubscribe = subscribe((value) => {
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
