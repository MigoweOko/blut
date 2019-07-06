import { Client } from "discord.js"

import { loadCommands, loadEvents } from './utils/loader'
const { mongodbURI }: { mongodbURI: string } = require('../config.json')

import ICommand from "./interfaces/command"
import IEvent from "./interfaces/event"
import { GlobalUser, GuildUser, Guild, UserActions, Reminder } from "./interfaces/DBInterfaces";
import { Collection, MongoClient, Db as Database } from "mongodb";

export default class Bot {

    client: Client = new Client({ disableEveryone: true });
    commands: ICommand[] = [];
    events: IEvent[] = [];

    GlobalUsers: Collection<GlobalUser>;
    GuildUsers: Collection<GuildUser>;
    Guilds: Collection<Guild>;
    UsersActions: Collection<UserActions>;
    RemindersDB: Collection<Reminder>;

    Reminders: Reminder[];
    userCooldowns: { id: string, lastmsg: number, timeout: number }[];

    async start(token: string): Promise<void> {
        process.on('unhandledRejection', console.error);

        let conn: MongoClient = await MongoClient.connect(mongodbURI, { useNewUrlParser: true });
        let database: Database = conn.db('DiscordBot');

        this.GlobalUsers = database.collection('GlobalUsers');
        this.GuildUsers = database.collection('GuildUsers');
        this.Guilds = database.collection('Guilds');
        this.UsersActions = database.collection('UsersActions');
        this.RemindersDB = database.collection('RemindersDB');
        this.Reminders = [];

        this.userCooldowns = [];

        loadEvents(this);
        loadCommands(this);

        this.client.login(token);
    }
}