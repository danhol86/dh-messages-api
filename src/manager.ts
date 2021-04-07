export class MessagesManager {

    static SetupMsgData(msgData, messagesFound) {
        messagesFound.sort((a, b) => (parseInt(b.LastMsgTimeStamp) > parseInt(a.LastMsgTimeStamp)) ? 1 : -1);
        msgData = msgData ? msgData : {};
        msgData.Conversations = msgData.Conversations ? msgData.Conversations : {};
        msgData.ProcessedMessages = msgData.ProcessedMessages ? msgData.ProcessedMessages : [];

        var convsRequiringUpdate; convsRequiringUpdate = [];
        var logcurrent = false;
        for(var con in messagesFound) {
            var item = messagesFound[con];
            if(!msgData.LastTimeStamp) {
                logcurrent = true;
                msgData.LastTimeStamp = item.LastMsgTimeStamp;
            }

            msgData.Conversations[item.ConvId] = {
                Recipients : item.Recipients,
                RoomName : item.ConvName,
                UserId : item.UserId
            };

            if(item.LastMsgTimeStamp > msgData.LastTimeStamp && msgData.ProcessedMessages.indexOf(item.LastMsgId) < 0) {
                convsRequiringUpdate.push(item.ConvId);
            }
        }

        return {
            MessageData : msgData,
            ConversationsNeeded : convsRequiringUpdate
        };
    }

    static async SetupConvData(msgData, messagesFound, messages) {
        var newMessages; newMessages = [];
        messagesFound.sort((a, b) => (parseInt(a.MsgId) > parseInt(b.MsgId)) ? 1 : -1)
        
        for(var con in messagesFound) {
            var item = messagesFound[con];

            if(item.MsgTimeStamp > msgData.LastTimeStamp && msgData.ProcessedMessages.indexOf(item.MsgId) < 0) {
                newMessages.push(item);
            }
        }

        for(var newm in newMessages) {
            var mess = newMessages[newm];

            var msgImage; msgImage = null;
            var msgImageName; msgImageName = null;
            if(mess.ImageData && mess.ImageData[8]) {
                mess.MsgImage = await messages.DownloadFile(mess.ImageData[8], mess.ImageData[11]);
                mess.MsgImageName = mess.ImageData[3]
            }
            var convData = msgData.Conversations[mess.ConvId];
            var recipNo =  mess.MsgSentByUser 
                ? convData.Recipients[0]
                : convData.Recipients.find(x => x.Id == mess.UserId);

            if(!recipNo) {
                recipNo = convData.Recipients[0]
            }

            mess.ConvData = convData;
            mess.RecipNo = recipNo.Number.replace("+", "")
            mess.MsgDate = new Date(mess.MsgTimeStamp / 1000);
        }
        return newMessages;
    }
}