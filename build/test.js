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
    //await New();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEseUNBQTRDO0FBQzVDLGlDQUFpQztBQUNqQywyQkFBaUQ7QUFDakQsdUNBQTRDO0FBSTVDLE1BQU0sUUFBUSxHQUFJLElBQUkseUJBQWMsRUFBRSxDQUFDO0FBRXZDLENBQUMsR0FBUyxFQUFFO0lBQ1IsY0FBYztJQUNkLE1BQU0sUUFBUSxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFBLENBQUMsRUFBRSxDQUFDO0FBR0wsU0FBZSxJQUFJLENBQUMsT0FBZTs7UUFDL0IsSUFBSTtZQUNBLElBQUksY0FBYyxDQUFDO1lBQUMsY0FBYyxHQUFHLGlCQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0QsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM3QyxPQUFPLFdBQVcsQ0FBQztTQUN0QjtRQUFDLFdBQU0sR0FBRztRQUNYLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FBQTtBQUFBLENBQUM7QUFFRixTQUFlLElBQUksQ0FBQyxXQUFnQixFQUFFLE9BQWU7O1FBQ2pELGtCQUFhLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FBQTtBQUFBLENBQUM7QUFFRixTQUFlLFNBQVMsQ0FBQyxHQUFHOztRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FBQTtBQUVELE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFOztRQUNqQixTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNyQyxNQUFNLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7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