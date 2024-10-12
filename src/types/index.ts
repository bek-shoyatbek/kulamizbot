import { Context, SessionFlavor } from "grammy";

export interface SessionData {
    awaitingTitle?: {
        fileId: string;
        duration: number;
    };
}


export type MyContext = Context & SessionFlavor<SessionData>;