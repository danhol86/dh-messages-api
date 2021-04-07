export declare class MessagesManager {
    static SetupMsgData(msgData: any, messagesFound: any): {
        MessageData: any;
        ConversationsNeeded: any;
    };
    static SetupConvData(msgData: any, messagesFound: any, messages: any): Promise<any>;
}
