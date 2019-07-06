import IEvent from "../interfaces/event"
import { Message, RichEmbed } from "discord.js";
import bot from "..";
import ICommand from "../interfaces/command";
import { prefix } from "../../config.json"
import { GlobalUser, GuildUser } from "../interfaces/DBInterfaces";


export default class EventMessage implements IEvent {
    async run(message: Message): Promise<void> {
        if (message.author.bot || !message.guild) return;

        let experience: number = Math.round(Math.random()) + 2

        if (!bot.userCooldowns.find((s) => s.includes(message.author.id))) {
            bot.userCooldowns.push(message.author.id);

            console.log(`Timeouted ${message.author.tag}`);
        } else console.log(`${message.author.tag} is typing too fast`);
        setTimeout(() => {
            bot.userCooldowns.splice(bot.userCooldowns.findIndex((v) => v.includes(message.author.id)));
        }, 20000);

        let glu: GlobalUser = await bot.GlobalUsers.findOne({ id: message.author.id });
        if (!glu) {
            let inserted = await bot.GlobalUsers.insertOne({
                id: message.author.id,
                msgs: 1,
                exp: experience,
                cash: 0,
                reps: 0
            });
            console.log(`Inserted new GlobalUser with id ${message.author.id}, tag ${message.author.tag}`);
        } else {
            if (!bot.userCooldowns.find((s) => s.includes(message.author.id)))
                await bot.GlobalUsers.findOneAndUpdate({ id: message.author.id }, {
                    $inc: {
                        msgs: 1,
                        exp: experience,
                        cash: 5
                    }
                });
        }


        let giu: GuildUser = await bot.GuildUsers.findOne({ id: message.author.id, gid: message.guild.id });
        if (!giu) {
            let inserted = await bot.GuildUsers.insertOne({
                gid: message.guild.id,
                id: message.author.id,
                msgs: 1,
                exp: experience,
            });
            console.log(`Inserted new GuildUser with id ${message.author.id}, tag ${message.author.tag}`);
        } else {
            if (!bot.userCooldowns.find((s) => s.includes(message.author.id)))
                await bot.GuildUsers.findOneAndUpdate({ id: message.author.id, gid: message.guild.id }, {
                    $inc: {
                        msgs: 1,
                        exp: experience
                    }
                });
        }

        if (message.content.startsWith(prefix)) {
            let args: string[] = message.content.split(/\ /g);
            let cmdName: string = args.shift().substr(prefix.length);
            let command: ICommand = bot.commands.find((cmd: ICommand) => cmd.basic.aliases.includes(cmdName)) as ICommand;
            if (command) {
                command.run(message, args).catch((reason) => {
                    console.error(`Error while executing ${message.content}, Reason ${reason}`)
                    let embed: RichEmbed = new RichEmbed()
                        .setTitle('Error')
                        .setAuthor(message.member.displayName, message.author.displayAvatarURL)
                        .setColor("#f54242")
                        .setDescription(reason);
                    message.channel.send(embed).then((msg: Message) => {
                        msg.delete(30000);
                    })
                })
            } else {
                await message.react('❓')
            }
        }
    };

    name: string = 'message';
}