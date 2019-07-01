import ICommand from '../interfaces/command';
import { Message, RichEmbed } from 'discord.js';
import bot from '..';

export default class Help implements ICommand {
    async run(message: Message, args: string[]) {
        var str = args.join(' ');

        let embed: RichEmbed = new RichEmbed()
            .setTitle('Help')
            .setAuthor(message.member.displayName, message.author.displayAvatarURL)
            .setColor("#4287f5");

        let cmdArgs: { page: string, name: string } = { page: "1", name: undefined };

        if (/--\w+\s\S+/g.test(str)) {
            let regexed = str.match(/--\w+\s\S+/g);
            str = str.replace(/--\w+\s\S+/g, '');

            regexed.forEach((v) => {
                if (/name|page/g.test(v.substring(2, v.indexOf(' ')))) {
                    cmdArgs[v.substring(2, v.indexOf(' '))] = v.substring(v.indexOf(' ') + 1)
                }
            });
        }

        if (cmdArgs['name']) {
            let c = bot.commands.find((cmd) => cmd.basic.aliases.includes(cmdArgs['name']))
            if (c) {
                embed.addField(c.basic.aliases.join(', '), c.basic.description)
                .setDescription(c.basic.detailedUsage)
            } else {
                throw `Command with name ${cmdArgs['name']} doesnt exists`
            }
        } else {
            throw "Help with page doesnt work at the moment, sorry!"
        }
        message.channel.send(embed);
    }
    basic = {
        aliases: ['help'],
        description: 'Displays info about commands',
        detailedUsage: 'help --page (number)\nhelp --name (command)'
    };
}