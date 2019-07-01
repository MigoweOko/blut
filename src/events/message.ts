import IEvent from "../interfaces/event"
import { Message, RichEmbed } from "discord.js";
import bot from "..";
import ICommand from "../interfaces/command";
import { prefix } from "../../config.json"



export default class EventMessage implements IEvent {
    async run(message: Message): Promise<void> {
        if (message.author.bot && !message.guild) return;

        if (message.content.startsWith(prefix)) {
            let args = message.content.split(/\ /g);
            let cmdName = args.shift().substr(prefix.length);
            let command: ICommand = bot.commands.find((cmd: ICommand) => cmd.basic.aliases.includes(cmdName)) as ICommand;
            if (command) {
                command.run(message, args).catch((reason) => {
                    let embed: RichEmbed = new RichEmbed()
                        .setTitle('Error')
                        .setAuthor(message.member.displayName, message.author.displayAvatarURL)
                        .setColor("#f54242")
                        .setDescription(reason);
                    message.channel.send(embed).then((msg:Message)=>{
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