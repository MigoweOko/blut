import ICommand from '../interfaces/command';
import { Message, RichEmbed, User, GuildMember } from 'discord.js';
import bot from '..';

export default class Avatar implements ICommand {
    async run(message: Message, args: string[]) {
        let user: GuildMember;

        if (args.length > 0) {
            user = message.mentions.members.first() ||
                message.guild.members.find((gm) =>
                    gm.displayName.toLowerCase().includes(args.join(' ').toLowerCase()) ||
                    gm.user.username.toLowerCase().includes(args.join(' ').toLowerCase()) ||
                    gm.user.id.includes(args.join(' '))
                );
        }

        if (!user) user = message.member;
        let av: string = user.user.displayAvatarURL;

        let embed: RichEmbed = new RichEmbed()
            .setTitle(av)
            .setURL(av)
            .setAuthor(user.displayName, av)
            .setColor("#4287f5")
            .setImage(av);
        await message.channel.send(embed);
    }
    basic = {
        aliases: ['avatar', 'av'],
        description: 'Gives avatar link in Rich Embed',
        detailedUsage: 'avatar @user#1234\navatar user',
        category: 'utility'
    };
}