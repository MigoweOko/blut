import IEvent from "../interfaces/event";
import bot from '..'
import { Reminder } from "../interfaces/DBInterfaces";
import { User } from "discord.js";

let remindersToBotInterval: number = 30 * 1000;
let remindersToUsers: number = 5 * 1000;

let indexQuestionMarkCommaNoIDontThinkIWillNameItProperlyCauseILikeLongNamesThatCannotFitInOneLineIThinksItsGoodForYourMentalHealthGoodBye: number = 0
export default class EventReady implements IEvent {
    async run(): Promise<void> {
        console.log("Bot is ready!");
        change();
        setInterval(() => {
            change();
        }, 180000)

        getReminders()
        setInterval(() => {
            getReminders();
        }, remindersToBotInterval)

        sendRemind()
        setInterval(() => {
            sendRemind();
        }, remindersToUsers)
    };
    name: string = 'ready';
}

function sendRemind() {
    bot.Reminders.filter((r) => r.time < Date.now()).forEach(async (reminder) => {
        let r: Reminder = bot.Reminders.splice(bot.Reminders.indexOf(reminder)).shift()
        let user: User = await bot.client.fetchUser(r.id)
        if (user) user.send(`${Math.floor(Math.random() * 4) ? '🔔' : 'BADING DING DONG'} : ${r.content}\n${Math.floor(Math.random() * 1000) ? '' : '~~1 out of 1000 can get this thingless message, you are the one!~~'}`)
    })
}

async function getReminders() {
    let r: Reminder[] = await bot.RemindersDB.find({ time: { $gte: Date.now() - remindersToBotInterval } }).toArray();
    r.forEach(async (r) => {
        bot.Reminders.push(r);
        await bot.RemindersDB.findOneAndDelete(r);
    })
}

function change() {
    switch (indexQuestionMarkCommaNoIDontThinkIWillNameItProperlyCauseILikeLongNamesThatCannotFitInOneLineIThinksItsGoodForYourMentalHealthGoodBye) {
        case 0:
            bot.client.user.setActivity(`${bot.client.users.filter((u) => !u.bot).size} users`, { type: 'LISTENING' });
            break;
        case 1:
            bot.client.user.setActivity(`${bot.client.guilds.size} guilds`, { type: 'WATCHING' });
            break;
        case 2:
            bot.client.user.setActivity(`..`, { type: 'LISTENING' });
            break;
        default:
            indexQuestionMarkCommaNoIDontThinkIWillNameItProperlyCauseILikeLongNamesThatCannotFitInOneLineIThinksItsGoodForYourMentalHealthGoodBye = 0;
            break;
    }
    indexQuestionMarkCommaNoIDontThinkIWillNameItProperlyCauseILikeLongNamesThatCannotFitInOneLineIThinksItsGoodForYourMentalHealthGoodBye++;
}