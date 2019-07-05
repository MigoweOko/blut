import ICommand from '../interfaces/command';
import { Message } from 'discord.js';
import bot from '..';
import { strToDHM } from '../utils/timeParser';

export default class Remind implements ICommand {
    async run(message: Message, cmdArgs: string[]) {
        let args: string[] = cmdArgs.join(' ').replace(/\s*:\s*/g, ':').split(' ');

        let option: string;
        let i: number;

        if (args.lastIndexOf('in') < 0 ? undefined : args.lastIndexOf('in') == args.length - 2) {
            i = args.lastIndexOf('in');
            option = 'in';
        } else if (args.lastIndexOf('on') < 0 ? undefined : args.lastIndexOf('on') == args.length - 2) {
            i = args.lastIndexOf('on');
            option = 'on';
        } else throw "Incorrectly specified time!";

        let remindContent: string = args.slice(0, i).join(' ');
        let dhm = strToDHM(args.pop()); // dhm haves d, h, m, idc about the f typing here
        dhm.d = dhm.d || 0;
        dhm.h = dhm.h || 0;
        dhm.m = dhm.m || 0;

        let wd: Date = new Date();
        if (option == 'in') {
            wd = new Date(wd.getFullYear(), wd.getMonth(), wd.getDate() + dhm.d, wd.getHours() + dhm.h, wd.getMinutes() + dhm.m, wd.getSeconds())
        } else {
            wd = new Date(wd.getFullYear(), wd.getMonth(), wd.getDate() + dhm.d, wd.getHours() - wd.getUTCHours() + dhm.h, dhm.m)
        }
        if (wd < new Date()) {
            throw Math.round(Math.random() * 2) ? "Time cannot be before, only past" : "You tried to be tricky this time!";
        }

        let inHowMuchTime: string = String();
        let deltaTime: number = Math.ceil((wd.valueOf() - Date.now()) / 1000);
        let m: number = Math.floor(deltaTime / 60) % 60;
        let h: number = Math.floor(deltaTime / 3600) % 24;
        let d: number = Math.floor(deltaTime / 3600 / 24);

        let add = await bot.RemindersDB.insertOne({ time: wd.valueOf(), id: message.author.id, content: remindContent })
        if (add) {
            await message.channel.send(`**Success fully added reminder**,\nYou will be reminded in ${d?`${d}d `:''}${h?`${h}h `:''}${m?`${m}min `:''}, UTC time : ${wd.toUTCString()}${Math.floor(Math.random() * 20) ? '':'~~, psst, its secret!~~'}`)
        } else {
            throw `Something wrong happend when adding your reminder to database, please try again`
        }
    }
    basic = {
        aliases: ['remind'],
        description: 'I can make a reminder for you!',
        detailedUsage: 'remind *remind msg* in dd:hh:mm / hh:mm / mm\n\n**BE AWARE, THIS ONE BELOW USES UTC TIME!!!**\nremind *remind msg* on DD:hh:mm\n# ex. 3:10:15 -> 3 days later on 10:15 GMT',
        category: 'utility'
    };
}