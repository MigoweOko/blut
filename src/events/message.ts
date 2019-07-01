import IEvent from "../interfaces/event"
import { Message } from "discord.js";
import bot from "..";
import ICommand from "../interfaces/command";
const { prefix }: { prefix: string } = require('../../config.json');


export default class EventMessage implements IEvent {
    async run(message: Message): Promise<void> {
        if (message.author.bot && !message.guild) return;

        if (message.content.startsWith(prefix)) {
            let args = message.content.split(/\ /g);
            let cmdName = args.shift().substr(prefix.length);
            let command: ICommand = bot.commands.find((cmd: ICommand) => cmd.basic.aliases.includes(cmdName)) as ICommand;
            if (command) {
                command.run(message, args)
            } else {
                await message.react('❓')
            }
        }
    };
    name: string = 'message';
}