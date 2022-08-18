export default class EventBus {
    listeners = new Map();
    add(event, handler, once) {
        [event].flat().forEach((event) => {
            this.listeners.set(event, this.listeners.get(event)?.add({ once, handler }) ??
                new Set([{ once, handler }]));
        });
    }
    on(event, handler) {
        this.add(event, handler, false);
    }
    once(event, handler) {
        this.add(event, handler, true);
    }
    emit(event, ...args) {
        this.listeners.get(event)?.forEach(({ once, handler }) => {
            handler(...args);
            once && this.listeners.delete(event);
        });
    }
    off(event, handler) {
        if (event === undefined) {
            this.listeners.clear();
        }
        else {
            [event].flat().forEach((event) => {
                if (handler === undefined) {
                    this.listeners.delete(event);
                }
                else {
                    this.listeners.get(event)?.forEach((payload, _, payloads) => {
                        handler === payload.handler && payloads.delete(payload);
                    });
                }
            });
        }
    }
}
