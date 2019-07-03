import ICommand from '../interfaces/command';
import { Message, RichEmbed, User, Permissions } from 'discord.js';
import bot from '..';
const { ownerid }: { ownerid: string } = require('../../config.json')

export default class Info implements ICommand {
    async run(message: Message, args: string[]) {

        let author: User = await bot.client.fetchUser(ownerid, true)

        let perms: number =
            Permissions.FLAGS.ADD_REACTIONS |
            Permissions.FLAGS.CHANGE_NICKNAME |
            Permissions.FLAGS.CREATE_INSTANT_INVITE |
            Permissions.FLAGS.EXTERNAL_EMOJIS |
            Permissions.FLAGS.KICK_MEMBERS |
            Permissions.FLAGS.BAN_MEMBERS |
            Permissions.FLAGS.MANAGE_NICKNAMES |
            Permissions.FLAGS.READ_MESSAGES |
            Permissions.FLAGS.READ_MESSAGE_HISTORY |
            Permissions.FLAGS.SEND_MESSAGES |
            Permissions.FLAGS.ADMINISTRATOR

        let embed: RichEmbed = new RichEmbed()
            .setTitle(`${bot.client.user.username}, bot info`)
            .setThumbnail(bot.client.user.displayAvatarURL)
            .setColor("#4287f5")
            .addField("Author", `${author}\nUsername and tag : ${author.tag}\nID : ${author.id}`)
            .addField('Invite link', await bot.client.generateInvite(perms));
        await message.channel.send(embed);
    }
    basic = {
        aliases: ['info'],
        description: 'Displays invite link and other stuff',
        detailedUsage: 'info',
        category: 'utility'
    };
}