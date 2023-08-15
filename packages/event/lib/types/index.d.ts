type Event = string | symbol;
export default class EventBus {
    private readonly listeners;
    private add;
    on(event: Event | Event[], handler: Function): void;
    once(event: Event, handler: Function): void;
    emit(event: Event, ...args: any[]): void;
    off(event?: Event | Event[], handler?: Function): void;
}
export {};
