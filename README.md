# react-signal

Send messages between components.

## Disclaimer

You might not want to use this.

If you need to share state between two components, then
[lift that state up](https://reactjs.org/docs/lifting-state-up.html)
to some common ancestor and pass the state as props.
If that common ancestor is too far up in your tree,
then you can use [context](https://reactjs.org/docs/context.html)
to share that state without having to do
[prop drilling](https://kentcdodds.com/blog/prop-drilling).

So when should you use this?

Use this when you want to send some kind of message from one component to another,
without having that message rest in state somewhere.

## Installation

Using npm:

```sh
npm install react-signal
```

Using yarn:

```sh
yarn add react-signal
```

## Usage

```js
import { createSignal } from 'react-signal';
import React from 'react';

const Signal = createSignal();

function Publisher() {
  const publish = Signal.usePublish();

  return <button onClick={() => publish('hello')}>Click me</button>;
}

function Subscriber() {
  Signal.useSubscription((message) => {
    console.log('Received: ', message);
  });

  return <p>Check the console</p>;
}

function App() {
  return (
    <Signal.Provider>
      <Publisher />
      <Subscriber />
    </Signal.Provider>
  );
}
```

## Contributing

Please feel free to submit any issues or pull requests.

## License

MIT
