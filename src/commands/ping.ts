import ICommand from '../interfaces/command';
import { Message } from 'discord.js';
import bot from '..';

export default class Ping implements ICommand {
    async run(message: Message, args: string[]) {
        let str: string = args.join(' ');
        let cmdFlags: { time: boolean, silent: boolean } = { time: false, silent: false };
        let regex: RegExp = /-\w+/g
        if (regex.test(str)) {
            let regexed: RegExpMatchArray = str.match(regex);
            str = str.replace(regex, '');

            regexed.forEach((v) => {
                cmdFlags[v.substring(1)] = true;
            });
        }

        (cmdFlags.time || cmdFlags.silent) ? null : cmdFlags.silent = true;

        if (cmdFlags.time) {
            let msg: string[] = [];
                msg.push(`API response time : **${bot.client.ping.toFixed(2)}ms**`)
                msg.push(`Message time : **???ms**`)
            let time: number = Date.now();
            let timeSecond: number;
            await message.channel.send(msg).then((m: Message) => {
                timeSecond = m.createdAt.valueOf()
                msg.pop();
                msg.push(`Message time : **${timeSecond - time}ms**`)
                m.edit(msg)
            })
        } else if (cmdFlags.silent) {
            await message.react('🏓');
        }
    }
    basic = {
        aliases: ['ping', 'pong'],
        description: 'Displays api response time and message time\n(default) or reacts with 🏓',
        detailedUsage: 'ping -time\nping -silent',
        category: 'utility'
    };
}