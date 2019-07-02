import ICommand from '../interfaces/command';
import { Message } from 'discord.js';
import bot from '..';

export default class Choose implements ICommand {
    async run(message: Message, args: string[]) {
        let str: string = args.join(' ');
        let regexed: string[] = str.split(/;|\/|\|/);

        let choosen: string;
        if (regexed.length >= 2) choosen = regexed[Math.floor(Math.random() * regexed.length)];
        else throw 'You need to specify at least two things to choose';

        await message.channel.send(`${message.member.displayName}, i've had choosen : **${choosen}**`);
    }
    basic = {
        aliases: ['choose'],
        description: 'Let me decide what you choose!\nThe Delimeters are : `; / |`',
        detailedUsage: 'choose one;two/three|four'
    };
}