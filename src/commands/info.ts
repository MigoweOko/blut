import ICommand from '../interfaces/command';
import { Message } from 'discord.js';
import bot from '..';

export default class Info implements ICommand {
    async run(message: Message, args: string[]) {
        
    }
    basic = {
        aliases: ['info'],
        description: 'Displays invite link and other stuff',
        detailedUsage: 'info',
        category: 'utility'
    };
}