import Bot from "../bot"
// COMMANDS

import Evaluate from "../commands/evaluate"

export const loadCommands = (bot: Bot): void => {
    bot.commands.push(
        new Evaluate
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
    bot.events.forEach((IE) => {
        bot.client.addListener(IE.name, IE.run);
    })
}