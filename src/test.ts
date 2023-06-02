import { MessagesClient } from "./messages";
import * as QRCode from 'qrcode';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { MessagesManager } from './manager';

const messages  = new MessagesClient();

(async () => {

    //create data folder to store session data and message ids for each conversation.
    if (!existsSync("data")){
        mkdirSync("data");
    }

    // run this first to setup new client and get QR code. once scanned, all events after should be emitted including conversation list and messages etc.
    //await New();

    //run this after initial setup has already been complete to use session data from New function
    await Existing();
})();


async function Read(fileLoc: string) {
    try {
        var sessionDataStr; sessionDataStr = readFileSync(fileLoc);
        var sessionData = JSON.parse(sessionDataStr);
        return sessionData;
    } catch { }
    return null;
};

async function Save(sessionData: any, fileLoc: string) {
    writeFileSync(fileLoc, sessionData);
};

async function LogMessge(str) {
    console.log(new Date().toLocaleString() + " - " + str);
}

process.on('SIGINT', async function() {
    LogMessge("Caught interrupt signal");
    await messages.Close();
    process.exit();
});

async function New() {
    var mc = new MessagesClient();

    mc.on('error', async e => {
        LogMessge("ERROR - " + e);
    });

    mc.on('qrcode', async u => {
        LogMessge("QR CODE Found - " + u);
        await SaveQRCode(u, "myqrcode.png");
    });

    mc.on('sessiondata', async sd => {
        LogMessge("Updated session data");
        Save(sd, "data/sessionData.txt");

        await Existing();
    });

    await mc.Connect();
}

var msgData;

async function Existing() {

    messages.on('closed', async m => {
        LogMessge("Closed - " + m);
    });

    messages.on('error', async e => {
        LogMessge("ERROR - " + e);
    });

    messages.on('sessiondata', async sd => {
        LogMessge("Updated session data");
        Save(sd, "data/sessionData.txt");
    });

    messages.on('invalidtoken', async sd => {
        LogMessge("Invalid Token");
    });

    messages.on('messsagelist', async m => {
        var messagesFound = JSON.parse(m);
        var retmsgData = MessagesManager.SetupMsgData(msgData, messagesFound);
        msgData = retmsgData.MessageData;

        for(var newm in retmsgData.ConversationsNeeded) {
            var conv = retmsgData.ConversationsNeeded[newm];
            await messages.GetMessages(conv);
        }
        Save(JSON.stringify(msgData), "data/msgData.txt");
    });

    messages.on('debug', async m => {
        LogMessge("New debug message - " + m);
    });

    messages.on('messageupdate', async m => {
        var updateFound = JSON.parse(m);
        LogMessge("Messages Update for id - " + updateFound[0].ConvId + " - " + updateFound[0].StatusText);
    });
    
    messages.on('convlist', async m => {
        var p; p = {};
        p.data = {};
        p.data.MessageData = msgData;

        var messagesFound = JSON.parse(m);

        var newMessages = await MessagesManager.SetupConvData(msgData, messagesFound, messages);
        for(var newm in newMessages) {
            var mess = newMessages[newm];
            LogMessge("New Message Received - " + mess.MsgText);
            msgData.ProcessedMessages.push(mess.MsgId);
        }
        Save(JSON.stringify(msgData), "data/msgData.txt");
    })
    
    var sessionData = await Read("data/sessionData.txt");
    try {
        msgData = await Read("data/msgData.txt");
    } catch {}

    await messages.Setup(sessionData);
}

var allMessages: any[] = [];

async function SaveQRCode(qrlink, fileloc) {
    var imgurl = await QRCode.toDataURL(qrlink);
    var base64Data = imgurl.replace(/^data:image\/png;base64,/, "");
    writeFileSync(fileloc, base64Data, 'base64');
}