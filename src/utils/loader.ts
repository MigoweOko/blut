import Bot from "../bot"

export const loadCommands = (bot: Bot): void => {
    bot.commands.push(

    );
}

export const loadEvents = (bot: Bot): void => {
    bot.events.push(

    );
    bot.events.forEach((IE) => {
        bot.client.addListener(IE.name, IE.run);
    })
}