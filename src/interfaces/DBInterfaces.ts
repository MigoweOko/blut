export interface Guild {
    _id?: string;

    rankmsgs: boolean;
    prefix: string;
    greet?: string;
    language: string;
    id: string;
}

export interface GuildUser {
    _id?: string;

    msgs: number;
    exp: number;
    gid: string;
    id: string;
}

export interface GlobalUser {
    _id?: string;

    msgs: number;
    exp: number;
    id: string;
    cash: number;
}

export interface UserActions {
    _id?: string;

    id: string;
    actions: string[];
}