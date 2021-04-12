"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("./messages");
const QRCode = require("qrcode");
const fs_1 = require("fs");
const manager_1 = require("./manager");
const messages = new messages_1.MessagesClient();
(() => __awaiter(void 0, void 0, void 0, function* () {
    //create data folder to store session data and message ids for each conversation.
    if (!fs_1.existsSync("data")) {
        fs_1.mkdirSync("data");
    }
    // run this first to setup new client and get QR code. once scanned, all events after should be emitted including conversation list and messages etc.
    //await New();
    //run this after initial setup has already been complete to use session data from New function
    yield Existing();
}))();
function Read(fileLoc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var sessionDataStr;
            sessionDataStr = fs_1.readFileSync(fileLoc);
            var sessionData = JSON.parse(sessionDataStr);
            return sessionData;
        }
        catch (_a) { }
        return null;
    });
}
;
function Save(sessionData, fileLoc) {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.writeFileSync(fileLoc, sessionData);
    });
}
;
function LogMessge(str) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(new Date().toLocaleString() + " - " + str);
    });
}
process.on('SIGINT', function () {
    return __awaiter(this, void 0, void 0, function* () {
        LogMessge("Caught interrupt signal");
        yield messages.Close();
        process.exit();
    });
});
function New() {
    return __awaiter(this, void 0, void 0, function* () {
        var mc = new messages_1.MessagesClient();
        mc.on('error', (e) => __awaiter(this, void 0, void 0, function* () {
            LogMessge("ERROR - " + e);
        }));
        mc.on('qrcode', (u) => __awaiter(this, void 0, void 0, function* () {
            LogMessge("QR CODE Found - " + u);
            yield SaveQRCode(u, "myqrcode.png");
        }));
        mc.on('sessiondata', (sd) => __awaiter(this, void 0, void 0, function* () {
            LogMessge("Updated session data");
            Save(sd, "data/sessionData.txt");
            yield Existing();
        }));
        yield mc.Connect();
    });
}
var msgData;
function Existing() {
    return __awaiter(this, void 0, void 0, function* () {
        messages.on('closed', (m) => __awaiter(this, void 0, void 0, function* () {
            LogMessge("Closed - " + m);
        }));
        messages.on('error', (e) => __awaiter(this, void 0, void 0, function* () {
            LogMessge("ERROR - " + e);
        }));
        messages.on('sessiondata', (sd) => __awaiter(this, void 0, void 0, function* () {
            LogMessge("Updated session data");
            Save(sd, "data/sessionData.txt");
        }));
        messages.on('invalidtoken', (sd) => __awaiter(this, void 0, void 0, function* () {
            LogMessge("Invalid Token");
        }));
        messages.on('messsagelist', (m) => __awaiter(this, void 0, void 0, function* () {
            var messagesFound = JSON.parse(m);
            var retmsgData = manager_1.MessagesManager.SetupMsgData(msgData, messagesFound);
            msgData = retmsgData.MessageData;
            for (var newm in retmsgData.ConversationsNeeded) {
                var conv = retmsgData.ConversationsNeeded[newm];
                yield messages.GetMessages(conv);
            }
            Save(JSON.stringify(msgData), "data/msgData.txt");
        }));
        messages.on('debug', (m) => __awaiter(this, void 0, void 0, function* () {
            LogMessge("New debug message - " + m);
        }));
        messages.on('messageupdate', (m) => __awaiter(this, void 0, void 0, function* () {
            var updateFound = JSON.parse(m);
            LogMessge("Messages Update for id - " + updateFound[0].ConvId + " - " + updateFound[0].StatusText);
        }));
        messages.on('convlist', (m) => __awaiter(this, void 0, void 0, function* () {
            var p;
            p = {};
            p.data = {};
            p.data.MessageData = msgData;
            var messagesFound = JSON.parse(m);
            var newMessages = yield manager_1.MessagesManager.SetupConvData(msgData, messagesFound, messages);
            for (var newm in newMessages) {
                var mess = newMessages[newm];
                LogMessge("New Message Received");
                msgData.ProcessedMessages.push(mess.MsgId);
            }
            Save(JSON.stringify(msgData), "data/msgData.txt");
        }));
        var sessionData = yield Read("data/sessionData.txt");
        try {
            msgData = yield Read("data/msgData.txt");
        }
        catch (_a) { }
        yield messages.Setup(sessionData);
    });
}
var allMessages = [];
function SaveQRCode(qrlink, fileloc) {
    return __awaiter(this, void 0, void 0, function* () {
        var imgurl = yield QRCode.toDataURL(qrlink);
        var base64Data = imgurl.replace(/^data:image\/png;base64,/, "");
        fs_1.writeFileSync(fileloc, base64Data, 'base64');
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEseUNBQTRDO0FBQzVDLGlDQUFpQztBQUNqQywyQkFBd0U7QUFDeEUsdUNBQTRDO0FBSTVDLE1BQU0sUUFBUSxHQUFJLElBQUkseUJBQWMsRUFBRSxDQUFDO0FBRXZDLENBQUMsR0FBUyxFQUFFO0lBRVIsaUZBQWlGO0lBQ2pGLElBQUksQ0FBQyxlQUFVLENBQUMsTUFBTSxDQUFDLEVBQUM7UUFDcEIsY0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCO0lBRUQscUpBQXFKO0lBQ3JKLGNBQWM7SUFFZCw4RkFBOEY7SUFDOUYsTUFBTSxRQUFRLEVBQUUsQ0FBQztBQUNyQixDQUFDLENBQUEsQ0FBQyxFQUFFLENBQUM7QUFHTCxTQUFlLElBQUksQ0FBQyxPQUFlOztRQUMvQixJQUFJO1lBQ0EsSUFBSSxjQUFjLENBQUM7WUFBQyxjQUFjLEdBQUcsaUJBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzdDLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBQUMsV0FBTSxHQUFHO1FBQ1gsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUFBO0FBQUEsQ0FBQztBQUVGLFNBQWUsSUFBSSxDQUFDLFdBQWdCLEVBQUUsT0FBZTs7UUFDakQsa0JBQWEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDeEMsQ0FBQztDQUFBO0FBQUEsQ0FBQztBQUVGLFNBQWUsU0FBUyxDQUFDLEdBQUc7O1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUFBO0FBRUQsT0FBTyxDQUFDLEVBQUUs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