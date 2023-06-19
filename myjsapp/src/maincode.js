const PROTO = require('./protobuf.js');
const HTTP = require('./httpfunctions.js');
const helpers = require('./helpers.js');
const json = require('./json.js');
const keyconv = require('./keyconv.js');
const keyhelper = require('./keyhelper.js');
const rawp = require('./rawproto.js');
const httpfunctions = require('./httpfunctions.js');

async function ListenNewMessages(mydata, callback) {
    try {
        await CheckRefreshToken(data);
        await StartSession(data);
        await StartListenNewMessages(mydata, callback);
    } catch(ex) {
        console.log(ex);
        await ListenNewMessages(mydata, callback)
    }
}

async function StartListenNewMessages(mydata, callback) {
    await GetNewMessages(mydata.pr_tachyon_auth_token, mydata.googleApi, async (data) => {

        var deckey = Buffer.from(mydata.crypto_msg_enc_key, 'base64');

        try {
            var resp = await ProcessChunks(data, deckey);

            if(resp.currentChunks.length > 0) {
                for(var x=0; x < resp.currentChunks.length ; x++) {
                    var myItem =  resp.currentChunks[x];

                    var askarr = [];
                    console.log(myItem.guid);
                    askarr.push(myItem.guid);
                    var respack = await GetAckMessages(mydata.pr_tachyon_auth_token, askarr, mydata.googleApi);

                    var mchunk = myItem.data;

                    var proto64 = Buffer.from(mchunk).toString('base64');

                    var rcode = myItem.rcode;
                    var messageList = null;
                    if(rcode == 1) {
                        messageList = await PROTO.DecodeProto(Buffer.from(mchunk));
                    }  else if(rcode == 2) {
                        messageList = await PROTO.DecodeProtoConvMessages(Buffer.from(mchunk));
                    } else if(rcode == 16) {
                        messageList = await PROTO.DecodeProtoUpdateMessage(Buffer.from(mchunk));
                    }


                    callback(rcode, messageList);
                }        
            }

        } catch(err) {
            console.log(err);
        } 

        return false;
    });
}


async function TriggerSendMessage(mydata, convId, senderId, text) {

    var tempid = `tmp_${Math.floor(999999999999 * Math.random())}`;
    var sendObj = await PROTO.CreateNewSMSProtoBuf(tempid, convId, senderId, text);

    var buffer = Buffer.from(sendObj);
    var qrcode =  buffer.toString('base64');

    var sendmess3id = helpers.generateUUID();
    await SendWithMessage(sendObj, sendmess3id, mydata.sessionid, 3, mydata.crypto_msg_enc_key, mydata.crypto_msg_hmac, mydata.bugle, mydata.pr_tachyon_auth_token, mydata.googleApi)
}

async function ProcessChunks(respd, deckey) {

    allconv = respd[0];

    if(allconv === undefined) return;

    currentChunks = [];

    for (var i = 0; i < allconv.length; i++) {
        var currentItem = allconv[i];
        const currentItemGuid = currentItem[1] ? currentItem[1][0] : null;
        if(currentItemGuid == null) continue;

        var lastdata = currentItem[1][11];
        var proto = Buffer.from(lastdata, 'base64');

        var betterproto = await PROTO.DecodeNewResponseProto(proto);
        var conv = betterproto.message;

        var decdata = await keyhelper.DeCryptMessage2(Buffer.from(conv), deckey);

        if(decdata) {
            currentChunks.push({ 
                item: currentItem,
                guid: currentItemGuid,
                data: decdata,
                rcode: betterproto.rcode
            })
        }
    }

    return ({currentChunks});
}

async function CheckRefreshToken(mydata) {
    if(mydata.expiredate ) {
        var expData = Date.parse(mydata.expiredate);
        var currdate = Date.now();
        if(expData < currdate) {
            await RefreshToken(mydata);
        }
    }
}

async function TriggerGetMessages(mydata, convId) {

    var reqarr = await PROTO.CreateRequestMessageProtoBuf(convId);
    var sendmess3id = helpers.generateUUID();
    var sendmess3 = await SendWithMessage(reqarr, sendmess3id, mydata.sessionid, 2, mydata.crypto_msg_enc_key, mydata.crypto_msg_hmac, mydata.bugle, mydata.pr_tachyon_auth_token, mydata.googleApi)
}

function GetdateFromExp(d) {
    var expiredate = d / 60000000;

    var d1 = new Date (),
    d2 = new Date ( d1 );
    d2.setMinutes ( d1.getMinutes() + expiredate - 60 );
    return d2;
}

async function RefreshToken(mydata) {
    var reftoken = await GetPostRefreshToken(mydata.crypto_pri_key, mydata.crypto_pub_key, mydata.bugle15, mydata.pr_tachyon_auth_token, mydata.googleApi);
    var respdata = JSON.parse(reftoken);
    var newtacyon = respdata[1][0];
    var newbug15 = respdata[8][0][0];
    mydata.expiredate = GetdateFromExp(respdata[1][1]);
    mydata.pr_tachyon_auth_token = newtacyon;
    mydata.bugle15 = newbug15;
}

async function GetPostRefreshToken(crypto_pri_key, crypto_pub_key, bugle15, pr_tachyon_auth_token, googleapi) {
        
    var utimestamp = Math.floor(+new Date() / 1) * 1000;
    var refreqid = helpers.generateUUID();

    var rtoken = await keyhelper.GetRefreshToken(crypto_pri_key, crypto_pub_key, refreqid, utimestamp);
    var refjson = json.GetRefreshTokenJSON(refreqid, pr_tachyon_auth_token, bugle15, utimestamp, rtoken);

    var mystr = JSON.stringify(refjson)
    const base64 = btoa(mystr);

    var httprespack; httprespack = await httpfunctions.httpPostAckMessages("/$rpc/google.internal.communications.instantmessaging.v1.Registration/RegisterRefresh", JSON.stringify(refjson), googleapi);



    return httprespack;
}

async function WaitForUserScan(mydata) {
    await GetRecMessages(mydata.qrbase64, mydata.googleApi, async (data) => {
        try {
            var allrecdata = await GetRecData(data);
            mydata.pr_tachyon_auth_token = allrecdata.n64;
            mydata.bugle = allrecdata.bugle;
            mydata.bugle15 = allrecdata.bugle15;
            mydata.expiredate = helpers.GetdateFromExp(allrecdata.expdate);
            mydata.respguid = allrecdata.guid;
            return true;
        } catch{}
        return false;
    });
}

async function GetRecData(respd) {

    var alldresp;
    found = false;
    for(var x = 1; x < 10; x++) {
        try {
            alldresp = respd[0][x];
            var b64 = alldresp[1][11];
            found = true;

            break;
        } catch {

        }
    }

    if(found == false) {
        try {
            alldresp = respd[0][6][1];
            var b64 = alldresp[1][11];
        } catch {
            try {
                alldresp = respd[0][2];
                var b64 = alldresp[1][11];
            } catch {
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
            }
        }
    }

    var subresp = alldresp[1];

    var respguid = subresp[0];
    var bugled = subresp[7];
    
    var b64 = subresp[11];

    var subbuffer = Buffer.from(b64, "base64");
    var subrespdata = await rawp.GetProtoFromBuffer(subbuffer)
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

async function TriggerGetMessageList(data, nummessages) {
    var sendmess3id = helpers.generateUUID();
    var sendmess4 = await SendWithMessage([16, nummessages], sendmess3id, data.sessionid, 1, data.crypto_msg_enc_key, data.crypto_msg_hmac, data.bugle, data.pr_tachyon_auth_token, data.googleApi)
}

async function StartSession(data) {
    var webenc = await GetWebKey(data);

    data.sessionid = helpers.generateUUID();
    var sendmessageid = helpers.generateUUID();

    var sendmess1 = await GetSendMessage(data.sessionid, sendmessageid, 31, data.bugle, data.pr_tachyon_auth_token, data.googleApi, new Uint8Array(0));
    var sendmess2 = await GetSendMessage(data.sessionid, data.sessionid, 16, data.bugle, data.pr_tachyon_auth_token, data.googleApi, new Uint8Array(0));

    if(sendmess2) {
        var sResp = JSON.parse(sendmess2);
        
        if(sResp[0] && sResp[0][1]) {

        } else if(sResp[2][0][0] == "type.googleapis.com/google.internal.communications.instantmessaging.v1.TachyonError") {
            console.log("Oh no");
            return;
        }
    }
}

async function SendWithMessage(message, sendmessageid, sessionid, midcode, crypto_msg_enc_key, crypto_msg_hmac, bugle, pr_tachyon_auth_token, googleapi) 
    {
        var mydata = await keyhelper.EncryptMessage(message, crypto_msg_enc_key, crypto_msg_hmac);
        var sendmess2 = await GetSendMessage(sessionid, sendmessageid, midcode, bugle, pr_tachyon_auth_token, googleapi, mydata);
        return sendmess2;
    }

async function GetSendMessage(sessionid, sendmessageid, midcode, bugleresp, uint8qr1, googleapi, message) {

    var sendproto = await PROTO.CreateSendMessageBuf(sessionid, midcode, sendmessageid, message);

    var sendprotoBuff = Buffer.from(sendproto).toString("base64");

    var sendjsonstring = json.getSendMessagesStringJSON(bugleresp, sendmessageid, uint8qr1, sendprotoBuff);
    var httprespack;
    httprespack = await httpfunctions.httpPostAckMessages("/$rpc/google.internal.communications.instantmessaging.v1.Messaging/SendMessage", JSON.stringify(sendjsonstring), googleapi);
        
    return httprespack;
}

async function GetWebKey(data) {
    var webgetwebenc = await GetWebEnc(data.googleApi, data.pr_tachyon_auth_token);
    var bweb = Buffer.from(webgetwebenc);
    var webenccryptokey = await keyhelper.GetEncryptionData(bweb);
    return webenccryptokey;
}


async function GetWebEnc(googleapi, n64) {
    var uintbuf = Buffer.from(n64, 'base64');
    var uint8conv = new Uint8Array(uintbuf)

    var uniId = helpers.generateUUID();
    var ackreqid = await PROTO.CreateEncProtoBuf(uniId, uint8conv);
    var httprespwebenc = await httpfunctions.httpPostWebEnc(ackreqid, googleapi);

    return httprespwebenc;
}

async function GetAckMessages(n64, guids, googleapi) {
    var ackreqid = helpers.generateUUID();
    var ackmessage = json.getAckMessagesStringJSON(ackreqid, guids, n64, 8);
    var httprespack = await httpfunctions.httpPostAckMessages("/$rpc/google.internal.communications.instantmessaging.v1.Messaging/AckMessages", JSON.stringify(ackmessage), googleapi);
    return httprespack;
}

async function GetNewMessages(pr_tachyon_auth_token, googleapi, callback) {
    var reqid = helpers.generateUUID();
    var respstring = json.getRecMessagesStringJSON(reqid, pr_tachyon_auth_token, 8);
    var respd = await httpfunctions.httpPostNewMessages(JSON.stringify(respstring), googleapi, callback);

    return respd;
}

async function GetRecMessages(pr_tachyon_auth_token, googleapi, callback) {
    var reqid = helpers.generateUUID();
    var respstring = json.getRecMessagesStringJSON(reqid, pr_tachyon_auth_token, 8);
    var respd = await httpfunctions.httpPostRecMessages(JSON.stringify(respstring), googleapi, callback);

    return respd;
}


async function GetNewSetupData() {
    var data = await keyhelper.getKeyData();
    var convKeys = helpers.ArrayFromKey(data.pubkeyexp);
    var newbarr = keyconv.ConvertKey(convKeys);
    var uniId = helpers.generateUUID();
    var proto = await PROTO.CreateProto(newbarr, uniId);
    var googleHtml = await HTTP.GetGoogle();
    var googleApi = helpers.GetGoogleApiFromHtml(googleHtml);
    var postphone = await HTTP.PostPhoneRelay(proto, googleApi);
    var newresp = helpers.getResponseBuffer(postphone);
    var pro = await rawp.GetProtoFromBuffer(newresp);
    data.googleApi = googleApi;
    data.qrreqdata = pro[2][3];
    
    var myb64 = pro[4][5][0][1];

    data.qrbase64 = pro[4][5][0][1].toString('base64');

    return data;
}

async function getQRCodeLink(qrdata, crypto_msg_enc_key, crypto_msg_hmac) {    
    var uint8qr = new Uint8Array(qrdata);
    
    var qrproto = await PROTO.CreateQR(uint8qr, crypto_msg_enc_key, crypto_msg_hmac);
    var bufferqrproto = Buffer.from(qrproto);
    var qrcodeqrproto =  bufferqrproto.toString('base64');
    return "https://g.co/amr?c=" + qrcodeqrproto;
}

module.exports = {
    GetNewSetupData,
    getQRCodeLink,
    WaitForUserScan,
    StartSession,
    ListenNewMessages,
    TriggerSendMessage,
    CheckRefreshToken,
    TriggerGetMessages,
    TriggerGetMessageList
}