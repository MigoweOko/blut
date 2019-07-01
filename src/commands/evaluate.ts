import ICommand from '../interfaces/command';
import { Message } from 'discord.js';
import bot from '..';

export default class Evaluate implements ICommand {
    async run(message: Message, args: string[]) {
        await message.channel.send("!");
    }
    basic = {
        aliases: ['eval'],
        usage: undefined,
        detailedUsage: undefined
    };
}