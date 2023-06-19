const protobuf = require("protobufjs");

var loadProto = async function(pro) {
  const root = await new Promise((resolve, reject) => {
    protobuf.load(pro, function(err, root) {
        if (err) reject(err);
        else resolve(root);
    });
  });

  return root;
}

var getByteFromMessage = function(root, obj) {
  const message = root.create(obj);
    
  // Encode the message to a byte array
  const buffer = root.encode(message).finish();
  
  // Convert the byte array to Uint8Array
  const byteArray = new Uint8Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
      byteArray[i] = buffer[i];
  }

  return byteArray;
}

var CreateRequestMessageProtoBuf = async function(convi) {

  const root = await loadProto("proto/reqmessage.proto");

  // Obtain the message types
  const Person = root.lookupType("REQUESTMESSAGE");

  const person = Person.create({
    convid: convi,
    number: 50
  });

  var byteArray = getByteFromMessage(Person, person);
  return byteArray;
}

var CreateQRProtoBuf = async function(mybarray1, mybarray2, mybarray3) {

  const root = await loadProto("proto/qr.proto");

  // Obtain the message types
  const Person = root.lookupType("QR");

  const person = Person.create({
      p1: mybarray1,
      p2: mybarray2,
      p3: mybarray3
  });

  var byteArray = getByteFromMessage(Person, person);
  return byteArray;
}

var CreateSendMessageBuf = async function(mid1, mval, mid2, mess) {

    const root = await loadProto("proto/sendmessage.proto");
  
    // Obtain the message types
    const Person = root.lookupType("SENDMESSAGE");
  
    // Create a Person message using the defined schema
    const person = Person.create({
        id1: mid1,
        p2: mval,
        message: mess,
        id2: mid2,
    });
  
    var byteArray = getByteFromMessage(Person, person);
    return byteArray;
  }

  var DecodeNewResponseProto = async function(bytes) {

    const root = await loadProto("proto/newresponse.proto");
  
    // Obtain the message types
    const Person = root.lookupType("RESPONSE");
    const decodedMessage = Person.decode(bytes);

    return decodedMessage;
  }

  var DecodeProtoUpdateMessage = async function(bytes) {

    const root = await loadProto("proto/messagelist.proto");
  
    // Obtain the message types
    const Person = root.lookupType("UpdateMessage");
    const decodedMessage = Person.decode(bytes);

    return decodedMessage;
  }

  var DecodeProtoConvMessages = async function(bytes) {

    const root = await loadProto("proto/messagelist.proto");
  
    // Obtain the message types
    const Person = root.lookupType("MyMessage");
    const decodedMessage = Person.decode(bytes);

    return decodedMessage;
  }

  var DecodeProto = async function(bytes) {

    const root = await loadProto("proto/messagelist.proto");
  
    // Obtain the message types
    const Person = root.lookupType("MyMessage");
    const decodedMessage = Person.decode(bytes);

    return decodedMessage;
  }

  var CreateNewSMSProtoBuf = async function(tId, cID, sID, text) {

    const root = await loadProto("proto/sendsms.proto");

    const SENDSMS = root.lookupType("SENDSMS");
    const MData = root.lookupType("MData");
    const SubMData1 = root.lookupType("SubMData1");
    const SubMData2 = root.lookupType("SubMData2");
    const MessageText = root.lookupType("MessageText");

    const person = SENDSMS.create({
        convID: cID,
        MessageData: MData.create({
          tempID1: tId,
          tempID2: tId,
          senderID: sID,
          SubMessageData1: SubMData1.create({
            messageText: MessageText.create({
              value: text,
            })
          }),
          convID: cID,
          SubMessageData2: SubMData2.create({
            messageText: MessageText.create({
              value: text,
            })
          })
        }),
        tempID: tId,
    });
  
    var byteArray = getByteFromMessage(SENDSMS, person);
    return byteArray;
  }

var CreateEncProtoBuf = async function(code, bytes) {

  const root = await loadProto("proto/enckey.proto");

  // Obtain the message types
  const Person = root.lookupType("Person");
  const P1Sheme = root.lookupType("P1Scheme");

  // Create a Person message using the defined schema
  const person = Person.create({
      p1: P1Sheme.create({
          guid: code,
          key: bytes,
          p1: P1Sheme.create({
              year: 2021,
              month: 2,
              day: 4,
              hour: 4,
              second: 6
          })
      })
  });

  var byteArray = getByteFromMessage(Person, person);
  return byteArray;
}

var CreateProtoBuf = async function(mybarray, code) {

  const root = await loadProto("proto/phonerelay.proto");

  // Obtain the message types
  const Person = root.lookupType("Person");
  const P1Sheme = root.lookupType("P1Scheme");
  const P2Scheme = root.lookupType("P2Scheme");
  const P3Scheme = root.lookupType("P3Scheme");

  // Create a Person message using the defined schema
  const person = Person.create({
      p1: P1Sheme.create({
          guid: code,
          bugle: "Bugle",
          p1: P1Sheme.create({
              year: 2021,
              month: 2,
              day: 4,
              hour: 4,
              second: 6
          })
      }),
      p2: P2Scheme.create({
          browser: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
          bnum: 2,
          os: "Windows",
          version: "10.0",
      }),
      p3: P3Scheme.create({
          p1: P1Sheme.create({
              bnum: 2,
              keyenc: mybarray
          })
      })
  });

  var byteArray = getByteFromMessage(Person, person);
  return byteArray;
}

module.exports = {
    CreateProto : CreateProtoBuf,
    CreateQR : CreateQRProtoBuf,
    CreateEncProtoBuf,
    CreateSendMessageBuf,
    DecodeProto,
    CreateNewSMSProtoBuf,
    DecodeNewResponseProto,
    DecodeProtoUpdateMessage,
    CreateRequestMessageProtoBuf,
    DecodeProtoConvMessages
}