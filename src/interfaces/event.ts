export default interface IEvent {
    run: (...args: any[]) => any;
    name: string;
}