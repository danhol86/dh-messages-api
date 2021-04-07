import { TypedEmitter } from 'tiny-typed-emitter';
interface MessagesClientEvents {
    'debug': (el: string) => void;
    'closed': (el: string) => void;
    'invalidtoken': (el: string) => void;
    'error': (el: string) => void;
    'qrcode': (el: string) => void;
    'sessiondata': (el: string) => void;
    'messsagelist': (el: string) => void;
    'convlist': (el: string) => void;
    'messageupdate': (el: string) => void;
    'receivemessage': (el: string) => void;
}
export declare class MessagesClient extends TypedEmitter<MessagesClientEvents> {
    private queue;
    private sessionid;
    private googleapi;
    private sessionData;
    private tempIdsSending;
    private processedChunks;
    private processedChunks2;
    private messageListFound;
    private retryCount;
    private recMessageChecker;
    private lastRecReceived;
    private recMessageCheckerSetup;
    GetMessages(convId: any): Promise<void>;
    Connect(): Promise<void>;
    SendMessage(convId: any, senderId: any, text: any): Promise<unknown>;
    Setup(sessiond: any): Promise<void>;
    DownloadFile(guid: any, key: any): Promise<string>;
    private ProcessAll;
    private decryptImage;
    private UKb;
    Close(): Promise<void>;
    private TriggerSendMessage;
    private getQRCodeLink;
    private getGoogleApi;
    private GetRecData;
    private GetPostRefreshToken;
    private GetdateFromExp;
    private RefreshToken;
    private CheckRefreshToken;
    private Initialise;
    private QueueFunction;
    private SetupPriorReceive;
    private StartChecker;
    private StopChecker;
    private CheckLatestReceiveMessages;
    private SendReceiveMessages;
    private GetWebKey;
    private GetNewRecMessages;
    private ProcessNewReceiveMessage;
    private TriggerGetMessages;
    private ProcessChunks;
    private SendWithMessage;
    private GetEncryptionData;
    private RegisterAndGetQR;
    private GetAckMessages;
    private GetRecMessages;
    private GetWebEnc;
    private GetSendMessage;
}
export {};
