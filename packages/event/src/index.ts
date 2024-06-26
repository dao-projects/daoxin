type Event = string | symbol;
export default class EventBus {
  private readonly listeners = new Map<
    Event,
    Set<{ once: boolean; handler: Function }>
  >();

  private add(event: Event | Event[], handler: Function, once: boolean): void {
    [event].flat().forEach((event) => {
      this.listeners.set(
        event,
        this.listeners.get(event)?.add({ once, handler }) ??
          new Set([{ once, handler }]),
      );
    });
  }

  on(event: Event | Event[], handler: Function): void {
    this.add(event, handler, false);
  }

  once(event: Event, handler: Function): void {
    this.add(event, handler, true);
  }

  emit(event: Event, ...args: any[]): void {
    this.listeners.get(event)?.forEach(({ once, handler }) => {
      handler(...args);
      once && this.listeners.delete(event);
    });
  }

  off(event?: Event | Event[], handler?: Function): void {
    if (event === undefined) {
      this.listeners.clear();
    } else {
      [event].flat().forEach((event) => {
        if (handler === undefined) {
          this.listeners.delete(event);
        } else {
          this.listeners.get(event)?.forEach((payload, _, payloads) => {
            handler === payload.handler && payloads.delete(payload);
          });
        }
      });
    }
  }
}
