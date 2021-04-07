export declare class HttpFunctions {
    static AllReqs: any[];
    static httpGetGoogle(): Promise<unknown>;
    static httpGetDownload(googdownloadmeta: any): Promise<unknown>;
    static httpPostWebEnc(data: any, googleapi: any): Promise<unknown>;
    static httpPostPhoneRelay(data: any, googleapi: any): Promise<unknown>;
    static CResp(httpresprec: any): any;
    static CorrectResponse(httpresprec: any): any;
    static httpPostRecMessages(jsondata: any, googleapi: any, callback: any): Promise<unknown>;
    static httpPostAckMessages(path: any, jsondata: any, googleapi: any): Promise<unknown>;
}
