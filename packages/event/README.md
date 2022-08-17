# EventBus

一个极简的 EventBus 事件总线.

## Install

```shell
npm i @daoxin/event
```

**or**

```shell
yarn add @daoxin/event
```

## Documentation

### Get Started

```js
import EventBus from "@daoxin/event";

const hub = new EventBus();

hub.on("custom-send", (message) => {
  console.log(message);
});

hub.emit("custom-send", "Hello, EventBus!");
// => Hello, EventBus!
```

or

```js
import mitt from "@daoxin/event/mitt";

const emitter = mitt()

// listen to an event
emitter.on('foo', e => console.log('foo', e) )

// listen to all events
emitter.on('*', (type, e) => console.log(type, e) )

// fire an event
emitter.emit('foo', { a: 'b' })

// clearing all events
emitter.all.clear()

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten

# typescript

import mitt from "@daoxin/event/mitt";

type Events = {
  foo: string;
  bar?: number;
};

const emitter = mitt<Events>(); // inferred as Emitter<Events>

emitter.on('foo', (e) => {}); // 'e' has inferred type 'string'

emitter.emit('foo', 42); // Error: Argument of type 'number' is not assignable to parameter of type 'string'. (2345)
// looks => https://github.com/developit/mitt
```

### Instance Methods

**Event**

Event name type.

```typescript
type Event = string | symbol;
```

#### on(event,handler)

- **Arguments:**
  - `{Event | Event[]} event`
  - `{Function} handler`

* **Usage:**

  Listen for a custom event on the current Instance. Events can be triggered by `instance.emit`. The handler will receive all the additional arguments passed into these event-triggering methods.

#### once(event,handler)

- **Arguments:**
  - `{Event} event`
  - `{Function} handler`

* **Usage:**

  Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

#### off([event,handler])

- **Arguments:**
  - `{Event | Event[]} event`
  - `{Function} [handler]`

* **Usage:**

  Remove custom event listener(s).

  - If no arguments are provided, remove all event listeners;
  - If only the event is provided, remove all listeners for that event;
  - If both event and handler are given, remove the listener for that specific handler only.

#### emit(event,...args)

- **Arguments:**

  - `{Event} event`

  - `{any} ...args`

* **Usage:**

  Trigger an event on the current instance. Any additional arguments will be passed into the listener’s handler function.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/dao-projects/daoxin/blob/main/LICENSE) file for details
