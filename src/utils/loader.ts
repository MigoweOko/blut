import Bot from "../bot"
// COMMANDS

import Evaluate from "../commands/evaluate"
import Help from "../commands/help";

export const loadCommands = (bot: Bot): void => {
    bot.commands.push(
        new Evaluate,
        new Help
    );
}

// EVENTS

import Ready from "../events/ready"
import Message from "../events/message"

export const loadEvents = (bot: Bot): void => {
    bot.events.push(
        new Ready,
        new Message
    );
    bot.events.forEach((ev) => {
        bot.client.addListener(ev.name, ev.run);
    })
}