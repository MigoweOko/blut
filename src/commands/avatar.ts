import ICommand from '../interfaces/command';
import { Message, RichEmbed, User, GuildMember } from 'discord.js';
import bot from '..';

export default class Avatar implements ICommand {
    async run(message: Message, args: string[]) {
        let user: GuildMember = message.mentions.members.first() || message.member;

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
        aliases: ['avatar','av'],
        description: 'Gives link to mentioned user avatar or yours',
        detailedUsage: 'avatar @user#1234',
        category: 'utility'
    };
}