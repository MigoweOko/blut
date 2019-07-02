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

        let cmdArgs: { page: string, name: string, category: string } = { page: "1", name: undefined, category: undefined };
        let regex = /\+\w+\s\S+/g;
        if (regex.test(str)) {
            let regexed: RegExpMatchArray = str.match(regex);
            str = str.replace(regex, '');

            regexed.forEach((v) => {
                cmdArgs[v.substring(1, v.indexOf(' '))] = v.substring(v.indexOf(' ') + 1)
            });
        }

        let filteredCommands: ICommand[] = bot.commands.filter((cmd) => !!cmd.basic.description && !!cmd.basic.detailedUsage && !!cmd.basic.category)
        if (cmdArgs.name) {
            let command: ICommand = filteredCommands.find((cmd) => cmd.basic.aliases.includes(cmdArgs.name))
            if (command) {
                embed.addField(command.basic.aliases.join(', '), command.basic.description)
                    .setDescription(command.basic.detailedUsage)
            } else {
                throw `Command with name ${cmdArgs.name} doesnt exists`
            }
        } else if (cmdArgs.page) {
            let cPp: number = 6;

            let page: number = parseInt(cmdArgs.page);
            let availablePages: number = Math.ceil(filteredCommands.length / cPp);
            if (page < 1) page = 1;
            if (page > availablePages) page = availablePages;
            let pageMinOne: number = page - 1;
            let commands: ICommand[] = filteredCommands.slice(pageMinOne * cPp, pageMinOne * cPp + cPp)

            commands.forEach((cmd) => {
                embed.addField(cmd.basic.aliases.join(', '), cmd.basic.description, true)
            })
            embed.setFooter(`${page} / ${availablePages}, available commands: ${filteredCommands.length}`)
        }
        await message.channel.send(embed);
    }
    basic = {
        aliases: ['help'],
        description: 'Displays info about commands',
        detailedUsage: 'help +page (number)\nhelp +name (command)\nhelp +category (category)',
        category: "utility"
    };
}