export declare class HelperFunctions {
    static ProcessConvData(data: any): {
        ConvId: any;
        ConvName: any;
        LastMsgId: any;
        UserId: any;
        LastMsgTimeStamp: any;
        Recipients: any;
        Avatar: string | null;
    };
    private static ProcessRecipients;
    static ProcessMsgData(data: any, tempIdsSending: any): {
        MsgId: any;
        MsgTimeStamp: any;
        ConvId: any;
        UserId: any;
        TempId: any;
        MsgText: any;
        MsgSubject: any;
        ImageData: any;
        StatusId: any;
        StatusText: any;
        MsgSentByUser: boolean;
        SentByClient: boolean;
    };
    static DeCryptMessage2(message: any, crypto_msg_enc_key: any): Promise<Uint8Array>;
    static EncryptMessage(message: any, crypto_msg_enc_key: any, crypto_msg_hmac: any): Promise<any>;
    static li(a: any): Promise<any>;
    static fw(hmac: any, a: any): Promise<Uint8Array>;
    static getResponseBuffer(httpresp: any): string;
    static groupBy2(xs: any, prop: any): {};
    static getKeys(): Promise<{
        crypto_msg_enc_key: Uint8Array;
        crypto_msg_hmac: Uint8Array;
        ECDSA_Keys: any;
    }>;
    static GetRefreshToken(privkey: any, pubkey: any, refreqid: any, utimestamp: any): Promise<string>;
    static Oha: (a: any) => Uint8Array;
    static EncodeUINT(c: any): any;
}
