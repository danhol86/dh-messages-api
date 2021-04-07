export declare class JsonFunctions {
    static dateObj: (number | null)[];
    static getRecMessagesStringJSON(reqid: any, b64: any, subnum: any): any[][];
    static getAckMessagesStringJSON(newguid: any, guids: any, n64: any, subnum: any): any[];
    static getSendMessagesStringJSON(bugle: any, respguid: any, respauth: any, sendproto64: any): any[];
    static GetRefreshTokenJSON(guid: any, oldtachyon: any, bugle: any, unixtimestamp: any, signedcode: any): any[];
}
