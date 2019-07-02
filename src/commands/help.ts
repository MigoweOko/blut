import ICommand from '../interfaces/command';
import { Message, RichEmbed } from 'discord.js';
import bot from '..';

export default class Help implements ICommand {
    async run(message: Message, args: string[]) {
        var str: string = args.join(' ');

        let embed: RichEmbed = new RichEmbed()
            .setTitle('Help')
            .setAuthor(message.member.displayName, message.author.displayAvatarURL)
            .setColor("#4287f5");

        let cmdArgs: { page: string, name: string } = { page: "1", name: undefined };

        if (/--\w+\s\S+/g.test(str)) {
            let regexed: RegExpMatchArray = str.match(/--\w+\s\S+/g);
            str = str.replace(/--\w+\s\S+/g, '');

            regexed.forEach((v) => {
                if (/name|page/g.test(v.substring(2, v.indexOf(' ')))) {
                    cmdArgs[v.substring(2, v.indexOf(' '))] = v.substring(v.indexOf(' ') + 1)
                }
            });
        }

        let filteredCommands: ICommand[] = bot.commands.filter((cmd) => !!cmd.basic.description && !!cmd.basic.detailedUsage)
        if (cmdArgs['name']) {
            let command: ICommand = filteredCommands.find((cmd) => cmd.basic.aliases.includes(cmdArgs['name']))
            if (command) {
                embed.addField(command.basic.aliases.join(', '), command.basic.description)
                    .setDescription(command.basic.detailedUsage)
            } else {
                throw `Command with name ${cmdArgs['name']} doesnt exists`
            }
        } else if (cmdArgs['page']) {
            let cPp: number = 6;

            let page: number = parseInt(cmdArgs['page']);
            let pageMinOne: number = page - 1;
            let commands: ICommand[] = filteredCommands.slice(pageMinOne * cPp, pageMinOne * cPp + cPp)

            commands.forEach((cmd) => {
                embed.addField(cmd.basic.aliases.join(', '), cmd.basic.description, true)
            })
            embed.setFooter(`${page} / ${Math.ceil(filteredCommands.length / cPp)}, available commands: ${filteredCommands.length}`)
        }
        await message.channel.send(embed);
    }
    basic = {
        aliases: ['help'],
        description: 'Displays info about commands',
        detailedUsage: 'help --page (number)\nhelp --name (command)'
    };
}