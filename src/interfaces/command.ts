
import { Message } from 'discord.js';

export default interface ICommand {
    run: (message: Message, args: string[]) => Promise<any>;
    basic: {
        aliases: string[],
        description: string,
        detailedUsage: string
    };
}