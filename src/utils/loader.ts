import Bot from "../bot"
// EVENTS
import Message from "../events/message"
import Ready from "../events/ready"

// COMMANDS
import Evaluate from "../commands/evaluate"
import Help from "../commands/help";
import Choose from "../commands/choose";
import Avatar from "../commands/avatar";
import Say from "../commands/say";
import Ping from "../commands/ping";

export const loadCommands = (bot: Bot): void => {
    bot.commands.push(
        new Evaluate,
        new Help,
        new Choose,
        new Avatar,
        new Say,
        new Ping
    );
}

export const loadEvents = (bot: Bot): void => {
    bot.events.push(
        new Ready,
        new Message
    );
    bot.events.forEach((ev) => {
        bot.client.addListener(ev.name, ev.run);
    })
}