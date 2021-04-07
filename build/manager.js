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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE1BQWEsZUFBZTtJQUV4QixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxhQUFhO1FBQ3RDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNFLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRXZGLElBQUksb0JBQW9CLENBQUM7UUFBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7UUFDcEQsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLEtBQUksSUFBSSxHQUFHLElBQUksYUFBYSxFQUFFO1lBQzFCLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QixJQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtnQkFDdkIsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdC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