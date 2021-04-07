import { getData } from 'rawproto';
import * as API from './api';
import * as cheerio from 'cheerio';
import * as crypto from 'crypto';
const { subtle } = require('crypto').webcrypto;
import { HttpFunctions } from './https';
import { JsonFunctions } from './json';
import { HelperFunctions } from './helpers';
import { TypedEmitter } from 'tiny-typed-emitter';
import {default as PQueue} from 'p-queue';

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

export class MessagesClient extends TypedEmitter<MessagesClientEvents> {

    private queue = new PQueue({concurrency: 1});
    private sessionid: any;
    private googleapi: any;
    private sessionData: any;
    private tempIdsSending : any = [];
    private processedChunks: any[] = [];
    private processedChunks2: any[] = [];
    private messageListFound = false;
    private retryCount = 0;
    private recMessageChecker: any;
    private lastRecReceived: any;
    private recMessageCheckerSetup: any;

    public async GetMessages(convId) {
        this.emit('debug', "Triggering new messages for convid - " + convId);
        await this.QueueFunction(() => this.TriggerGetMessages(convId));
    }  

    public async Connect() {
        await this.Initialise();

        this.sessionData = {};
        var keys; keys = await HelperFunctions.getKeys();
        this.sessionData.crypto_msg_enc_key = Buffer.from(keys.crypto_msg_enc_key).toString('base64');
        this.sessionData.crypto_msg_hmac = Buffer.from(keys.crypto_msg_hmac).toString('base64');
        var pubkeyexp = await subtle.exportKey("jwk", keys.ECDSA_Keys.publicKey);
        var privkeyexp = await subtle.exportKey("jwk", keys.ECDSA_Keys.privateKey);

        this.sessionData.crypto_pub_key = Buffer.from(JSON.stringify(pubkeyexp)).toString('base64');
        this.sessionData.crypto_pri_key = Buffer.from(JSON.stringify(privkeyexp)).toString('base64');

        var qrdata = await this.RegisterAndGetQR(pubkeyexp, this.googleapi, keys.crypto_msg_enc_key, keys.crypto_msg_hmac);

        this.emit('qrcode', qrdata.QRLink);
        var respguid;
        await this.GetRecMessages(qrdata.RelayData[4][5][0][1].toString('base64'), this.googleapi, async (data) => {
            try {
                var allrecdata = await this.GetRecData(data);
                this.sessionData.pr_tachyon_auth_token = allrecdata.n64;
                this.sessionData.bugle = allrecdata.bugle;
                this.sessionData.bugle15 = allrecdata.bugle15;
                this.sessionData.expiredate = this.GetdateFromExp(allrecdata.expdate);
                respguid = allrecdata.guid;
                return true;
            } catch{}
            return false;
        });

        this.emit('sessiondata', JSON.stringify(this.sessionData));

        var httprespack = await this.GetAckMessages(this.sessionData.pr_tachyon_auth_token, [
            respguid
        ], this.googleapi);
    }

    public async SendMessage(convId, senderId, text) {
        var tempid = `tmp_${Math.floor(999999999999 * Math.random())}`;
        return new Promise(async (resolve, reject) =>  {
            this.on('convlist', m => {
                var messagesFound = JSON.parse(m);
                for(var m in messagesFound) {
                    var mess = messagesFound[m];
                    if(mess.TempId == tempid) {
                        resolve(mess);
                    }
                }
            });

            await this.QueueFunction(() => this.TriggerSendMessage(tempid, convId, senderId, text));
        });
    }

    public async Setup(sessiond) {
        this.messageListFound = false;
        this.sessionData = sessiond;

        this.queue = new PQueue({concurrency: 1});

        await this.QueueFunction(() => this.Initialise());

        this.on('receivemessage', async m => {
            var data = JSON.parse(m);
            await this.QueueFunction(() => this.ProcessNewReceiveMessage(data));
        })

        this.on('error', async m => {
            this.emit('debug', "Error (no retries - " + this.retryCount + ") - " + m);

            this.StopChecker();

            this.retryCount = this.retryCount + 1;

            if(this.retryCount < 5) {
                await this.QueueFunction(() => this.SetupPriorReceive());
            } else {
                this.emit('invalidtoken', m);
            }
        });

        await this.QueueFunction(() => this.SetupPriorReceive());
    }

    public async DownloadFile(guid, key) {
        key = Buffer.from(key, 'base64');
        var ui = Buffer.from(this.sessionData.pr_tachyon_auth_token, 'base64');
        var uint = new Uint8Array(ui);
        var d = await API.GetUploadRequest(uint, guid);
        var b64 = Buffer.from(d).toString('base64');
        var getresp; getresp = await HttpFunctions.httpGetDownload(b64);
        getresp = new Uint8Array(getresp);
        var mp = Math.pow(2, getresp[1]);
        var id = getresp.subarray(2);
        var enckey = key;

        var cryptokey = await subtle.importKey("raw", enckey, {
            name: "AES-GCM",
            length: enckey.length
        }, !1, ["encrypt", "decrypt"]);

        var dataresp = await this.ProcessAll(cryptokey, id, mp, false);

        return Buffer.from(dataresp).toString('base64');
    }

    private async ProcessAll(key, c, b, d) {
        let e; e = [];
            let f = 0
            , g = 0;
        const h = c.length;
        for (; f < h; ) {
            const l = Math.min(f + b, h)
                , n = c.slice(f, l);
            f = l;
            const r = this.UKb(g, f, h);
            var resp = await this.decryptImage(n, r, key);
            e.push(resp);
            g++
        }

        var a = e;
        c = 0;
        for (var b of a)
            c += b.length;
        c = new Uint8Array(c);
        b = 0;
        for (const d of a)
            c.set(d, b),
            b += d.length;
        return c
    }

    private async decryptImage(a, c, key) {
        var b; b = new Uint8Array(12);
        b.set(a.subarray(0, 12));
        b = {
            name: "AES-GCM",
            iv: b,
            tagLength: 128
        };

        c && (b.additionalData = c);

        return new Uint8Array(await subtle.decrypt(b, key, new Uint8Array(a.subarray(12))))
    }

    private UKb = function(a, c, b) {
        const d = new Uint8Array(5)
          , e = new DataView(d.buffer);
        let f = 4;
        for (; 0 < a; )
            e.setUint8(f, a % 256),
            a = Math.floor(a / 256),
            f--;
        c >= b && e.setUint8(0, 1);
        return d
    }

    public async Close() {
        this.emit('closed', 'Trying to close sessions');
        for (var b of HttpFunctions.AllReqs) {
            try {
                await b.destroy();
            } catch{}
        }
    }

    private async TriggerSendMessage(tempid, convId, senderId, text) {
        var convId = convId;
        var senderId = senderId;
        var mess = {
            "message"
                :{
                    "conversationId":convId,
                    "id":tempid,
                    "Gh":false,
                    "Lc":
                    {
                        "0": {
                            "order":Number.MAX_SAFE_INTEGER,
                            "qc":"0",
                            "Eq":"0",
                            "type":"text",
                            "text":text
                        }
                    },
                    "senderId":senderId,
                    "status":1,
                    "timestampMs":Date.now(),
                    "type":1,
                    "Yh":tempid
                },
                "Ko":false
            };

        this.tempIdsSending.push(tempid);

        var sendObj = API.GetSendMessageObj(mess.message);

        var sendmess3id = await API.GetReqId();
        await this.SendWithMessage(sendObj, sendmess3id, this.sessionid, 3, this.sessionData.crypto_msg_enc_key, this.sessionData.crypto_msg_hmac, this.sessionData.bugle, this.sessionData.pr_tachyon_auth_token, this.googleapi)
    }


    private async getQRCodeLink(qrdata, crypto_msg_enc_key, crypto_msg_hmac) {

        var uint8qr = new Uint8Array(qrdata);

        var qrdata = await API.QR(uint8qr, crypto_msg_enc_key, crypto_msg_hmac);
        var buffer = Buffer.from(qrdata);
        var qrcode =  buffer.toString('base64');

        return "https://g.co/amr?c=" + qrcode;
    }

    private async getGoogleApi() {

        var httpgoogle;
        httpgoogle = await HttpFunctions.httpGetGoogle();

        var ch = cheerio.load(httpgoogle);
        var allscripts = ch('script').get()[1].children[0].data;
        var reg = /(A16fYe\\x22,\\x5bnull,null,\\x22)(?<GoogleApi>.*?)(\\x22\\x5d\\n\\x5d\\n)/;

        var googleapi = allscripts.match(reg).groups.GoogleApi;
        return googleapi;
    }

    private async GetRecData(respd) {

        var alldresp;
        try {
            alldresp= respd;
            subresp = alldresp[1];
            var b64 = subresp[11];
        } catch {
            try {
                alldresp = respd[0][1];
                var b64 = alldresp[1][11];
            } catch {
                try {
                    alldresp = respd[0][2];
                    var b64 = alldresp[1][11];
                } catch {
                    alldresp = respd[0][3];
                    var b64 = alldresp[1][11];
                }
            }
        }
        var subresp = alldresp[1];
        var respguid = subresp[0];
        var bugled = subresp[7];
        var bugled15 = subresp[8];
        var b64 = subresp[11];

        var subbuffer = Buffer.from(b64, "base64");
        var subrespdata = getData(subbuffer)
        var newbff = Buffer.from(subrespdata[0][4][1][2]);

        var bufferToMatch = newbff.slice(2, newbff.length - 7);
        var newbase64 = Buffer.from(bufferToMatch).toString('base64');
        var bugle15data = subrespdata[0][4][2][3];
        var bug15 = [
            bugle15data[0][1],
            bugle15data[1][2],
            bugle15data[2][3],
        ]
        return {
            guid: respguid,
            bugle: bugled,
            bugle15: bug15, 
            n64: newbase64,
            expdate: 86400000000
        };
    }

    private async GetPostRefreshToken(crypto_pri_key, crypto_pub_key, bugle15, pr_tachyon_auth_token, googleapi) {
        
        var utimestamp = Math.floor(+new Date() / 1) * 1000;
        var refreqid = await API.GetReqId();
        var rtoken = await HelperFunctions.GetRefreshToken(crypto_pri_key, crypto_pub_key, refreqid, utimestamp);
        var refjson = JsonFunctions.GetRefreshTokenJSON(refreqid, pr_tachyon_auth_token, bugle15, utimestamp, rtoken);

        var httprespack; httprespack = await HttpFunctions.httpPostAckMessages("/$rpc/google.internal.communications.instantmessaging.v1.Registration/RegisterRefresh", JSON.stringify(refjson), googleapi);

        return httprespack;
    }

    private GetdateFromExp(d) {
        var expiredate = d / 60000000;

        var d1 = new Date (),
        d2 = new Date ( d1 );
        d2.setMinutes ( d1.getMinutes() + expiredate - 60 );
        return d2;
    }

    private async RefreshToken() {
        var reftoken = await this.GetPostRefreshToken(this.sessionData.crypto_pri_key, this.sessionData.crypto_pub_key, this.sessionData.bugle15, this.sessionData.pr_tachyon_auth_token, this.googleapi);
        var respdata = JSON.parse(reftoken);
        var newtacyon = respdata[1][0];
        var newbug15 = respdata[8][0][0];
        this.sessionData.expiredate = this.GetdateFromExp(respdata[1][1]);
        this.sessionData.pr_tachyon_auth_token = newtacyon;
        this.sessionData.bugle15 = newbug15;

        this.emit('sessiondata', JSON.stringify(this.sessionData));
    }

    private async CheckRefreshToken() {
        if(this.sessionData?.expiredate) {
            var expData = Date.parse(this.sessionData.expiredate);
            var currdate = Date.now();
            if(expData < currdate) {
                await this.RefreshToken();
            }
        }
    }

    private async Initialise() 
    {
        if(!this.googleapi) {
            await API.OnLoad();
            this.googleapi = await this.getGoogleApi();
        }
    }

    private async QueueFunction(func) {
        (async () => {
            try {
                await this.queue.add(func);
            } catch(err) {
                this.emit('error', err);
            }
        })();
    }

    private async SetupPriorReceive() {
        this.emit('debug', "Setting up connection");

        await this.CheckRefreshToken();

        var webenc = await this.GetWebKey()

        this.sessionid = await API.GetReqId();
        var sendmessageid = await API.GetReqId();

        //var sendmess1;
        var sendmess1 = await this.GetSendMessage(this.sessionid, sendmessageid, 31, this.sessionData.bugle, this.sessionData.pr_tachyon_auth_token, this.googleapi, new Uint8Array(0));
        var sendmess1 = await this.GetSendMessage(this.sessionid, sendmessageid, 31, this.sessionData.bugle, this.sessionData.pr_tachyon_auth_token, this.googleapi, new Uint8Array(0));
        var sendmess2 = await this.GetSendMessage(this.sessionid, this.sessionid, 16, this.sessionData.bugle, this.sessionData.pr_tachyon_auth_token, this.googleapi, new Uint8Array(0));
        
        this.sessionid = await API.GetReqId();
        var sendmess3id = await API.GetReqId();
        var sendmess4id = await API.GetReqId();
        var sendmess3 = await this.SendWithMessage([16, 25, 32, 1], sendmess3id, this.sessionid, 1, this.sessionData.crypto_msg_enc_key, this.sessionData.crypto_msg_hmac, this.sessionData.bugle, this.sessionData.pr_tachyon_auth_token, this.googleapi)
        var sendmess4 = await this.SendWithMessage([16, 1], sendmess4id, this.sessionid, 1, this.sessionData.crypto_msg_enc_key, this.sessionData.crypto_msg_hmac, this.sessionData.bugle, this.sessionData.pr_tachyon_auth_token, this.googleapi)

        if(sendmess4) {
            var sResp = JSON.parse(sendmess4);
            
            if(sResp[0] && sResp[0][1]) {

            } else if(sResp[2][0][0] == "type.googleapis.com/google.internal.communications.instantmessaging.v1.TachyonError") {
                this.emit('error', sResp[1]);
                return;
            }
        }

        this.retryCount = 0;
        this.StartChecker();
        this.SendReceiveMessages();
    }

    private StartChecker() {
        this.StopChecker();
        this.recMessageChecker = setInterval(this.CheckLatestReceiveMessages, 900000);
        this.recMessageCheckerSetup = Date.now();
    }

    private StopChecker() {
        if(this.recMessageChecker) clearInterval(this.recMessageChecker);
    }

    private CheckLatestReceiveMessages() {

        this.emit('debug', "Checking last update from Receive messages - " + this.lastRecReceived);

        if(this.lastRecReceived < this.recMessageCheckerSetup) {
            this.emit('error', 'Not receiving new recieve messages');
        }
        this.recMessageCheckerSetup = Date.now();
    }

    private async SendReceiveMessages() {
        try {
            await this.GetNewRecMessages();
            this.emit('error', "Connection ended");
        } catch(err) {
            this.emit('error', err);
        }
    }

    private async GetWebKey() {
        var webgetwebenc = await this.GetWebEnc(this.googleapi, this.sessionData.pr_tachyon_auth_token);
        var bweb = Buffer.from(webgetwebenc);
        var webenccryptokey = await this.GetEncryptionData(bweb);

        return webenccryptokey;
    }

    private async GetNewRecMessages() {
        var resp = await this.GetRecMessages(this.sessionData.pr_tachyon_auth_token, this.googleapi, async (data) => {
            this.lastRecReceived = Date.now();
            this.emit('receivemessage', JSON.stringify(data));
            return false;
        });  
    }

    private async ProcessNewReceiveMessage(data) {
        var deckey = Buffer.from(this.sessionData.crypto_msg_enc_key, 'base64');

        try {
            var chunksToEmit : any[] = [];
            var chunks = await this.ProcessChunks(data, deckey);
            var chunkdata = chunks.currentChunks;

            for (var i = 0; i < chunkdata.length; i++) {
                var chunk = chunkdata[i];
                if (chunk.guid && this.processedChunks2.indexOf(chunk.guid) < 0) {
                    try {
                        this.processedChunks2.push(chunk.guid);

                        var chunk1 = await API.ChunkProcess(chunk.data);
                        if(chunk1.hh && chunk1.hh[1] && chunk1.hh[1][0] && chunk1.hh[1][0][0] && chunk1.hh[1][0][3] && chunk1.hh[1][0][3][0]) {
                            this.messageListFound = true;
                            var allmessages = chunk1.hh[1];
                            var allmessagesBetter = allmessages.map(x => (HelperFunctions.ProcessConvData(x)));
                            this.emit('messsagelist', JSON.stringify(allmessagesBetter));
                            continue;
                        }

                        if(this.messageListFound == false) continue;

                        var chunk0 = await API.ChunkProcessNew(Buffer.from(chunk.data).toString('base64'), false, true);
                        if(chunk0.hh && chunk0.hh[1] && chunk0.hh[1][0] && chunk0.hh[1][0][0]) {
                            var allconvs = chunk0.hh[1];
                            var allconvsBetter = allconvs.map(x => (HelperFunctions.ProcessMsgData(x, this.tempIdsSending)));

                            this.emit('convlist', JSON.stringify(allconvsBetter));
                            continue;
                        }

                        var chunk3 = await API.ChunkProcessNew(Buffer.from(chunk.data).toString('base64'), false, false);
                        if(chunk3.hh && chunk3.hh[1] && chunk3.hh[1][0] && chunk3.hh[1][0][0]) {
                            try {
                                var allmessages = chunk3.hh[1];
                                var allmessagesBetter = allmessages.map(x => HelperFunctions.ProcessConvData(x));
                                this.emit('messsagelist', JSON.stringify(allmessagesBetter));
                                continue;
                            } catch {}
                        }
                        
                        var chunk2 = await API.ChunkProcessNew(Buffer.from(chunk.data).toString('base64'), true, false);
                        if(chunk2.hh && chunk2.hh[1] && chunk2.hh[1][0] && chunk2.hh[1][0][0]) {
                            var allconvs = chunk2.hh[1];
                            var allconvsBetter = allconvs.map(x => (HelperFunctions.ProcessMsgData(x, this.tempIdsSending)));
                            var groups = HelperFunctions.groupBy2(allconvsBetter, 'StatusId');
                            for(var g in groups) {
                                if(g == "100" || g == "1") {
                                    this.emit('convlist', JSON.stringify(groups[g]));
                                } else {
                                    this.emit('messageupdate', JSON.stringify(groups[g]));
                                }
                            }
                            
                            continue;
                        }
                    } 
                    catch(err) {
                        var error = err;

                    }
                }
            }
            if(chunks.currentGuids.length > 0) {
                var respack = await this.GetAckMessages(this.sessionData.pr_tachyon_auth_token, chunks.currentGuids, this.googleapi);
            }

        } catch {

        }
    }

    private async TriggerGetMessages(convId) {
        
        var reqarr = await API.GetRequestConv2(convId);
        var sendmess3id = await API.GetReqId();
        var sendmess3 = await this.SendWithMessage(reqarr, sendmess3id, this.sessionid, 2, this.sessionData.crypto_msg_enc_key, this.sessionData.crypto_msg_hmac, this.sessionData.bugle, this.sessionData.pr_tachyon_auth_token, this.googleapi)
    }

    private async ProcessChunks(respd, deckey) {

        const currentChunks: any[] = [];
        const currentGuids: any[] = [];

        var allconv = respd[0];

        for (var i = 0; i < allconv.length; i++) {
            var currentItem = allconv[i];
            const currentItemGuid = currentItem[1] ? currentItem[1][0] : null;
            if (currentItemGuid && this.processedChunks.indexOf(currentItemGuid) < 0) {
                currentGuids.push(currentItemGuid);
                try {
                    var lastdata = currentItem[1][11];
                    var proto = Buffer.from(lastdata, 'base64');
                    proto = getData(proto);
                    var conv = proto[3][8] ? proto[3][8] : proto[4][8];
                    var decdata;
                    try {
                        decdata = await HelperFunctions.DeCryptMessage2(Buffer.from(conv, 'base64'), deckey);
                    } catch {
                        decdata = await HelperFunctions.DeCryptMessage2(Buffer.from(conv), deckey);
                    }

                    this.processedChunks.push(currentItemGuid);

                    if(decdata) {
                        currentChunks.push({ 
                            item: currentItem,
                            guid: currentItemGuid,
                            data: decdata
                        })
                    }
                } catch {}
            }
        }

        return ({currentChunks, currentGuids});
    }

    private async SendWithMessage(message, sendmessageid, sessionid, midcode, crypto_msg_enc_key, crypto_msg_hmac, bugle, pr_tachyon_auth_token, googleapi) 
    {
        var mydata = await HelperFunctions.EncryptMessage(message, crypto_msg_enc_key, crypto_msg_hmac);
        var sendmess2 = await this.GetSendMessage(sessionid, sendmessageid, midcode, bugle, pr_tachyon_auth_token, googleapi, mydata);
        return sendmess2;
    }

    private async GetEncryptionData(webenc) {
        var bweb = Buffer.from(webenc);
        var uint = new Uint8Array(bweb);

        var decpart1 = uint.slice(0,15);
        var decpart2 = uint.slice(15,47);

        var subk = decpart2.slice(0, 16);

        var k1k = await API.GetKeyFromWebE(subk);

        var b = {
            kty: "oct",
            k: k1k,
            alg: "A128GCM",
            ext: !0
        };

        return await subtle.importKey("jwk", b, {
            name: "AES-GCM"
        }, !1, ["encrypt", "decrypt"]);
    }

    private async RegisterAndGetQR(pubkeyexp, googleapi, crypto_msg_enc_key, crypto_msg_hmac) {
        var resp = await API.Setup(pubkeyexp);

        var httpresp;
        httpresp = await HttpFunctions.httpPostPhoneRelay(resp.protodata, googleapi);

        var baserespons = HelperFunctions.getResponseBuffer(httpresp)
        var buffer = Buffer.from(baserespons, 'base64');
        var data = getData(buffer);
        var qrreqdata = data[2][3];

        var qrlink = await this.getQRCodeLink(qrreqdata, crypto_msg_enc_key, crypto_msg_hmac);

        return {
            RelayData: data,
            QRLink: qrlink
        }
    }

    private async GetAckMessages(n64, guids, googleapi) {
        var ackreqid = await API.GetReqId();
        var ackmessage = JsonFunctions.getAckMessagesStringJSON(ackreqid, guids, n64, 8);
        var httprespack = await HttpFunctions.httpPostAckMessages("/$rpc/google.internal.communications.instantmessaging.v1.Messaging/AckMessages", JSON.stringify(ackmessage), googleapi);
        return httprespack;
    }

    private async GetRecMessages(pr_tachyon_auth_token, googleapi, callback) {
        var reqid = await API.GetReqId();
        var respstring = JsonFunctions.getRecMessagesStringJSON(reqid, pr_tachyon_auth_token, 8);
        var respd = await HttpFunctions.httpPostRecMessages(JSON.stringify(respstring), googleapi, callback);

        return respd;
    }

    private async GetWebEnc(googleapi, n64) {
        var uintbuf = Buffer.from(n64, 'base64');
        var uint8conv = new Uint8Array(uintbuf)

        var ackreqid = await API.EncKey(uint8conv);
        var httprespwebenc;
        httprespwebenc = await HttpFunctions.httpPostWebEnc(ackreqid, googleapi);

        return httprespwebenc;
    }

    private async GetSendMessage(sessionid, sendmessageid, midcode, bugleresp, uint8qr1, googleapi, message) {

        var sendproto = await API.GetSendMessage(sendmessageid, sessionid, midcode, message);
        var sendprotoBuff = Buffer.from(sendproto).toString("base64");

        var sendjsonstring = JsonFunctions.getSendMessagesStringJSON(bugleresp, sendmessageid, uint8qr1, sendprotoBuff);
        var httprespack;
        httprespack = await HttpFunctions.httpPostAckMessages("/$rpc/google.internal.communications.instantmessaging.v1.Messaging/SendMessage", JSON.stringify(sendjsonstring), googleapi);
            
        return httprespack;
    }
}