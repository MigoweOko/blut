import ICommand from '../interfaces/command';
import { Message, RichEmbed } from 'discord.js';
import bot from '..';
import Bot from '../bot';
import { ownerid } from "../../config.json"

export default class Evaluate implements ICommand {
    bot: Bot;
    set: {} = {};
    async run(message: Message, [flagCmd, ...args]: string[]) {
        if (message.author.id != ownerid) throw "You are not permitted to use evaluate command!";
        this.bot = bot
        let flags = {};
        if (/^-silent$|^-s$/g.test(flagCmd)) {
            flags['silent'] = true
        } else {
            flags['silent'] = false;
            args.unshift(flagCmd)
        }

        let evaluated: any = eval(args.join(' '));
        if (flags['silent']) return;
        if (args.length == 0) throw 'No code specified';
        let embed: RichEmbed = new RichEmbed()
            .setTitle('Evaluated')
            .setAuthor(message.member.displayName, message.author.displayAvatarURL)
            .setColor("#4287f5")
            .setDescription(evaluated);

        await message.channel.send(embed).then((m: Message) => {
            m.delete(30000);
        })
    }
    basic = {
        aliases: ['eval'],
        description: undefined,
        detailedUsage: undefined,
        category: "owner"
    };
}