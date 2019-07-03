import ICommand from '../interfaces/command';
import { Message, RichEmbed, GuildMember } from 'discord.js';
import bot from '..';

export default class UserInfo implements ICommand {
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

        let embed: RichEmbed = new RichEmbed()
            .setTitle(`Userinfo ${user.user.tag}`)
            .setThumbnail(user.user.displayAvatarURL)
            .addField('ID', user.id, true)
            .addField('Pseudo', user.nickname || '*not set*', true)
            .addField('Account created at', user.user.createdAt.toUTCString(), true)
            .addField('User joined this guild at', user.joinedAt.toUTCString(), true)
            .addField(`Roles: [${user.roles.size}]`, user.roles.sort((a, b) =>
                a.calculatedPosition < b.calculatedPosition ? 1 : -1
            ).map((e) => e).join(', '))
            .setColor(user.displayColor == 0 ? "#4287f5" : user.displayColor)
        await message.channel.send(embed);
    }
    basic = {
        aliases: ['userinfo', 'ui'],
        description: 'Displays info about user',
        detailedUsage: 'userinfo ',
        category: 'Category'
    };
}