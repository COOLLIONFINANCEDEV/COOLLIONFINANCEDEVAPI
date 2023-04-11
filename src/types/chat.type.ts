export type NotificationData = {
    sender: {
        id: number;
        name: string;
    } | string;
    messageCount: number;
    messages: {
        level: "low" | "medium" | "high" | "highest";
        preheader?: string;
        id: number;
    }[];
}


export interface BaseMessageData {
    channel: "in-app" | "chat" | "email";
    do: "saved" | "send" | "saved-send";
    sender?: number;
    receiver?: number;
    created_at?: Date;
    content: string;
    preheader?: string;
};

export interface MailData extends BaseMessageData {
    channel: "email";
    subject: string;
    title: string;
    to: string;
    from?: {
        name?: string;
        email: string;
    };
}

export interface InAppMessageData extends BaseMessageData {
    channel: "in-app" | "chat";
    level: "low" | "medium" | "high" | "highest";
    posted: boolean;
}

export interface ChatMessageData extends InAppMessageData {
    channel: "chat";
    chat_id: number;
    reply_to?: number;
}

export type MessageData = MailData | InAppMessageData | ChatMessageData;
