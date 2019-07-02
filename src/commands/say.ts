import ICommand from '../interfaces/command';
import { Message } from 'discord.js';
import bot from '..';

export default class Say implements ICommand {
    async run(message: Message, args: string[]) {
        let str: string = args.join(' ');
        if (message.deletable) {
            await message.delete();
        }
        message.channel.send(str)
    }
    basic = {
        aliases: ['say'],
        description: 'You say me, i say you',
        detailedUsage: 'say (text)',
        category: 'fun'
    };
}