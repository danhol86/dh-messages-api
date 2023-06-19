const helpers = require('./helpers.js');
const maincode = require('./maincode.js');
const imgcreator = require('./imgcreator.js');
const rawp = require('./rawproto.js');
const protobuf = require('./protobuf.js');
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs');
const httpfunctions = require('./httpfunctions.js');

async function main() {

    const isRunningInWindows = process.platform === 'win32';

    var sessionFileName = "/data/sessionData.txt";
    var qrFileName = "/data/myqrcode.png";

    if(isRunningInWindows) {
        sessionFileName = "data/sessionData.txt";
        qrFileName = "data/myqrcode.png";
    }
    
    try {
        data = {};

        if(helpers.fileExists(sessionFileName)) {
            console.log("Session data found");
            data = helpers.readFile(sessionFileName);
        } else {
            console.log("No session data found, starting session creation");
            data = await maincode.GetNewSetupData();
            var qr = await maincode.getQRCodeLink(data.qrreqdata, data.crypto_msg_enc_key, data.crypto_msg_hmac)
            imgcreator.SaveQRCode(qr, qrFileName);
    
            console.log("qr created");
    
            await maincode.WaitForUserScan(data);
            console.log("Success");
            console.log(JSON.stringify(data));
    
            if (!existsSync("data")){
                mkdirSync("data");
            }        
        }

        await maincode.CheckRefreshToken(data);

        writeFileSync(sessionFileName, JSON.stringify(data));

        
        //await maincode.TriggerGetMessages(data, "62");
        //await maincode.TriggerSendMessage(data, "62", "331", "this is a test 1");
        //await maincode.TriggerSendMessage(data, "62", "331", "this is a test 2");

        var mssageidrec = [];

        const d = new Date();
        //await maincode.TriggerSendMessage(data, "62", "331", "this is a test " + d.toTimeString());
        //await maincode.TriggerGetMessageList(data, 10);

        await maincode.ListenNewMessages(data, async function(resp, messageList) {
            var mycode = resp;
            var mlist =messageList;
            if(mlist == null) return;
            
            if(mlist.update != null) {
                if(mlist.update.UpdateCode == 1) {
                    console.log("New session somehwere else");
                }
            }

            if(mycode == 1 || mycode == 2) {
                if(mlist && mlist.items && mlist.items.length > 0) console.log("(" + mycode + ") Message List - " + mlist.items.length);
            } else {
                if(mlist && mlist.updates && mlist.updates.length > 0) {
                    var MesssageStatus = mlist.updates[0].items[0].MessageData.MesssageStatus;
                    var MessageText = mlist.updates[0].items[0].Content.MessageValue.MessageText;
                    var MessageCode = mlist.updates[0].items[0].MessageData.MessageCode;
                    var Recipient = mlist.updates[0].items[0].RecipientId;
                    var MessageId = mlist.updates[0].items[0].MessageId;

                    if(mssageidrec.includes(MessageId) == false && MessageText.includes("REPLY") == false && Recipient == "66") 
                    {
                        mssageidrec.push(MessageId);
                        await maincode.TriggerSendMessage(data, "62", "331", "REPLY " + " " + MessageText + " " + d.toTimeString());
                        await maincode.TriggerGetMessageList(data, "5");
                    }

                    console.log("(" + MesssageStatus + ") " + MessageText + " - " + MessageCode + " : Recipient-" + Recipient);
                }
            }
        });

        
    } catch (error) {
        console.error(error);
    }
}

main();