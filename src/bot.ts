import { Client } from "discord.js"

import {loadCommands,loadEvents} from './utils/loader'

import ICommand from "./interfaces/command"
import IEvent from "./interfaces/event"

export default class Bot {
    client: Client = new Client({ disableEveryone: true });
    commands: ICommand[] = [];
    events: IEvent[] = [];

    async start(token: string): Promise<void> {
        process.on('unhandledRejection', console.error);

        loadEvents(this);
        loadCommands(this);

        this.client.login(token)
    }
}