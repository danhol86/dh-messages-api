"use strict";
//useful code in managing the responses from API. Such as filtering out existing messages, and downloading images where required
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
exports.MessagesManager = void 0;
class MessagesManager {
    static SetupMsgData(msgData, messagesFound) {
        messagesFound.sort((a, b) => (parseInt(b.LastMsgTimeStamp) > parseInt(a.LastMsgTimeStamp)) ? 1 : -1);
        msgData = msgData ? msgData : {};
        msgData.Conversations = msgData.Conversations ? msgData.Conversations : {};
        msgData.ProcessedMessages = msgData.ProcessedMessages ? msgData.ProcessedMessages : [];
        var convsRequiringUpdate;
        convsRequiringUpdate = [];
        var logcurrent = false;
        for (var con in messagesFound) {
            var item = messagesFound[con];
            if (!msgData.LastTimeStamp) {
                logcurrent = true;
                msgData.LastTimeStamp = item.LastMsgTimeStamp;
            }
            msgData.Conversations[item.ConvId] = {
                Recipients: item.Recipients,
                RoomName: item.ConvName,
                UserId: item.UserId
            };
            if (item.LastMsgTimeStamp > msgData.LastTimeStamp && msgData.ProcessedMessages.indexOf(item.LastMsgId) < 0) {
                convsRequiringUpdate.push(item.ConvId);
            }
        }
        return {
            MessageData: msgData,
            ConversationsNeeded: convsRequiringUpdate
        };
    }
    static SetupConvData(msgData, messagesFound, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            var newMessages;
            newMessages = [];
            messagesFound.sort((a, b) => (parseInt(a.MsgId) > parseInt(b.MsgId)) ? 1 : -1);
            for (var con in messagesFound) {
                var item = messagesFound[con];
                if (item.MsgTimeStamp > msgData.LastTimeStamp && msgData.ProcessedMessages.indexOf(item.MsgId) < 0) {
                    newMessages.push(item);
                }
            }
            for (var newm in newMessages) {
                var mess = newMessages[newm];
                var msgImage;
                msgImage = null;
                var msgImageName;
                msgImageName = null;
                if (mess.ImageData && mess.ImageData[8]) {
                    mess.MsgImage = yield messages.DownloadFile(mess.ImageData[8], mess.ImageData[11]);
                    mess.MsgImageName = mess.ImageData[3];
                }
                var convData = msgData.Conversations[mess.ConvId];
                var recipNo = mess.MsgSentByUser
                    ? convData.Recipients[0]
                    : convData.Recipients.find(x => x.Id == mess.UserId);
                if (!recipNo) {
                    recipNo = convData.Recipients[0];
                }
                mess.ConvData = convData;
                mess.RecipNo = recipNo.Number.replace("+", "");
                mess.MsgDate = new Date(mess.MsgTimeStamp / 1000);
            }
            return newMessages;
        });
    }
}
exports.MessagesManager = MessagesManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnSUFBZ0k7Ozs7Ozs7Ozs7OztBQUVoSSxNQUFhLGVBQWU7SUFFeEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsYUFBYTtRQUN0QyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNqQyxPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRSxPQUFPLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUV2RixJQUFJLG9CQUFvQixDQUFDO1FBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO1FBQ3BELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN2QixLQUFJLElBQUksR0FBRyxJQUFJLGFBQWEsRUFBRTtZQUMxQixJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsSUFBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7Z0JBQ3ZCLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFB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