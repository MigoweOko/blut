import ICommand from '../interfaces/command';
import { Message, ReactionEmoji, Emoji } from 'discord.js';
import bot from '..';
const { ownerid }: { ownerid: string } = require('../../config.json');

export default class EmojiCmd implements ICommand {
    async run(message: Message, args: string[]) {
        let str: string = args.join(' ');

        //Arguments, +
        let cmdArgs: { n: string } = { n: '1' };
        let regexArgs = /\+\w+\s\S+/g;
        if (regexArgs.test(str)) {
            let regexed: RegExpMatchArray = str.match(regexArgs);
            str = str.replace(regexArgs, '');

            regexed.forEach((v) => {
                cmdArgs[v.substring(1, v.indexOf(' '))] = v.substring(v.indexOf(' ') + 1)
            });
        }
        //Flags, -
        let cmdFlags: { global: boolean } = { global: false };
        let regexFlags: RegExp = /-\w+/g
        if (regexFlags.test(str)) {
            let regexed: RegExpMatchArray = str.match(regexFlags);
            str = str.replace(regexFlags, '');

            regexed.forEach((v) => {
                cmdFlags[v.substring(1)] = true;
            });
        }
        let n: number = message.author.id == ownerid ? parseInt(cmdArgs.n) < 20 ? parseInt(cmdArgs.n) : 20 : 1;

        let emojis: Emoji[] = cmdFlags.global ? bot.client.emojis.random(n) : message.guild.emojis.random(n);

        emojis.forEach((e) => {
            message.react(e)
        })
    }
    basic = {
        aliases: ['emoji', 'e'],
        description: 'Reacts with random emoji from guild\nor random from avaiable guilds',
        detailedUsage: 'emoji -global',
        category: 'fun'
    };
}