
import { Message } from 'discord.js';

export default interface ICommand {
    run: (message: Message, args: string[]) => any;
    basic: {
        aliases: string[],
        desc: string,
        usage: string,
        detailedUsage: string
    };
}