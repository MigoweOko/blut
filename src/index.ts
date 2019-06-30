import Bot from "./bot";

const { token }: { token: string } = require('../config.json');

const bot = new Bot();
export default bot;

bot.start(token);