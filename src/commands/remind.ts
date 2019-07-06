import ICommand from '../interfaces/command';
import { Message, MessageCollector, CollectorFilter } from 'discord.js';
import bot from '..';
import { strToDHMS } from '../utils/timeParser';
import { Reminder } from '../interfaces/DBInterfaces';

export default class Remind implements ICommand {
    async run(message: Message, args: string[]) {

        let str: string = args.join(' ');

        //Arguments, +
        let cmdArgs: { arg: string } = { arg: undefined };
        let regexArgs = /\+\w+\s\S+/g;
        if (regexArgs.test(str)) {
            let regexed: RegExpMatchArray = str.match(regexArgs);
            str = str.replace(regexArgs, '');
            regexed.forEach((v) => {
                cmdArgs[v.substring(1, v.indexOf(' '))] = v.substring(v.indexOf(' ') + 1)
            });
        }
        //Flags, -
        let cmdFlags: { remove: boolean, add: boolean } = { remove: false, add: false };
        let regexFlags: RegExp = /-\w+/g
        if (regexFlags.test(str)) {
            let regexed: RegExpMatchArray = str.match(regexFlags);
            str = str.replace(regexFlags, '');
            regexed.forEach((v) => {
                cmdFlags[v.substring(1)] = true;
            });
        }

        if (cmdFlags.add == cmdFlags.remove) throw "try one of these :\nremind -add *something* in/on 13d 23h 59m 59s\nremind -remove";

        if (cmdFlags.add) {
            let reason: string = await this.addReminder(message, args.slice(1)).catch((r: string) => { return r as any });
            if (reason) throw reason;
        }
        if (cmdFlags.remove) {
            let reason: string = await this.removeReminder(message, args.slice(1)).catch((r: string) => { return r as any });
            if (reason) throw reason;
        }
    }

    async addReminder(message: Message, args: string[]) {
        let userRemindersCount: number = await bot.RemindersDB.find({ id: message.author.id }).count();
        if (userRemindersCount >= 7) throw "You cant have more than 7 reminders!"
        let option: string;
        let i: number;

        if (!/\d+(?=s|m|h|d)/gi.test(args.join(' '))) throw "You need to specify time!";

        if (args.lastIndexOf('in') < 0 ? undefined : args.lastIndexOf('in') < args.length - 1) {
            i = args.lastIndexOf('in');
            option = 'in';
        } else if (args.lastIndexOf('on') < 0 ? undefined : args.lastIndexOf('on') < args.length - 1) {
            i = args.lastIndexOf('on');
            option = 'on';
        } else throw "You need to specify time!";


        let remindContent: string = args.slice(0, i).join(' ');
        let dhms = strToDHMS(args.slice(i + 1).join(' '));

        dhms.d = dhms.d || 0;
        dhms.h = dhms.h || 0;
        dhms.m = dhms.m || 0;
        dhms.s = dhms.s || 0;

        let wd: Date = new Date();
        if (option == 'in') {
            wd = new Date(wd.getFullYear(), wd.getMonth(), wd.getDate() + dhms.d, wd.getHours() + dhms.h, wd.getMinutes() + dhms.m, wd.getSeconds() + dhms.s)
        } else {
            wd = new Date(wd.getFullYear(), wd.getMonth(), wd.getDate() + dhms.d, wd.getHours() - wd.getUTCHours() + dhms.h, dhms.m, dhms.s)
        }
        if (wd < new Date()) {
            throw Math.round(Math.random() * 2) ? "You want to remind your self in before? i dont think soo!" : "You tried to be tricky this time!";
        }
        if (wd > new Date(Date.now() + 1209600000)) {
            throw "Time cant be greater than 14 days";
        }

        let inHowMuchTime: string = String();
        let deltaTime: number = Math.ceil((wd.valueOf() - Date.now()) / 1000);
        let m: number = Math.floor(deltaTime / 60) % 60;
        let h: number = Math.floor(deltaTime / 3600) % 24;
        let d: number = Math.floor(deltaTime / 3600 / 24);

        let reminderAdd = { time: wd.valueOf(), id: message.author.id, content: remindContent };
        let add = await bot.RemindersDB.insertOne(reminderAdd)

        if (add) {
            await message.channel.send(`**Successfully added reminder**,\nYou will be reminded in ${d ? `${d}d ` : ''}${h ? `${h}h ` : ''}${m ? `${m}min ` : ''}, UTC time : ${wd.toUTCString()}${Math.floor(Math.random() * 20) ? '' : '~~, psst, its secret!~~'}`)
            bot.Reminders.push(reminderAdd);
        } else {
            throw `Something wrong happend when adding your reminder to database, please try again`
        }
    };

    async removeReminder(message: Message, args: string[]) {
        let reminders: Reminder[] = bot.Reminders.filter((r) => r.id == message.author.id)
        if (reminders.length <= 0) {
            message.channel.send('You dont have any reminders')
            return;
        }

        let remindersMsg: string = '```xl\n' + reminders.map((r, i) => `[${i + 1}] : ${r.content} | ${new Date(r.time).toUTCString()}`).join('\n') + '```\n Please select number in `[ ]` to remove reminder, you have 20s left!';

        let rMsg = message.channel.send(remindersMsg)

        const msgFilter: CollectorFilter = (m: Message) => m.author.id == message.author.id;
        const collector: MessageCollector = message.channel.createMessageCollector(msgFilter, { time: 20000 });
        collector.on('collect', async m => {
            if (/\d+/gi.test(m.content)) {
                let remNumb: number = parseInt(m.content);
                let remToDel: Reminder = reminders[remNumb - 1];
                bot.Reminders.splice(bot.Reminders.indexOf(remToDel), 1);
                await bot.RemindersDB.findOneAndDelete(remToDel);
                rMsg.then((msg: Message) => {
                    msg.edit('✅ Successfully removed reminder');
                })

                collector.stop('removed');
            }
        });
        collector.once('end', () => {
            rMsg.then((msg: Message) => {
                msg.delete(10000);
            })
        })
    };


    basic = {
        aliases: ['remind'],
        description: 'I can make a reminder for you!',
        detailedUsage: 'remind *remind msg* in/on 13d 23h 59m 59s \n\n**BE AWARE, THIS ONE BELOW USES UTC TIME!!!**\nremind *remind msg* on DD:hh:mm\n# ex. 3d 10h 15m -> 3 days later on 10:15:00 GMT',
        category: 'utility'
    };
}