import IEvent from "../interfaces/event"

export default class EventReady implements IEvent {
    async run(): Promise<void> {
        console.log("Bot is ready!");
    };
    name: string = 'ready';
}