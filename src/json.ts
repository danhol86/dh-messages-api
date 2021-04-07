//all json objects used by protobuf. not sure on how numbers generated e.g. 2021 im assuming year, but doesnt seem to affect the calls.

export class JsonFunctions {

    static dateObj = [null,null,2021,2,15,null,4,null,6];

    static getRecMessagesStringJSON(reqid, b64, subnum) {
        var reqdata1 = [[
            reqid,
            null,
            null,
            null,
            null,
            b64,
            JsonFunctions.dateObj
        ]];

        return reqdata1;
    }

    static getAckMessagesStringJSON(newguid, guids, n64, subnum) { 
        var resjson =  [[
            newguid,
            null,
            null,
            null,
            null,
            n64,
            JsonFunctions.dateObj
        ],guids,null,[]

        ];

        return resjson;
    }

    static getSendMessagesStringJSON(bugle, respguid, respauth, sendproto64) { 

        var resjson =  [bugle,
        [
            respguid,
            19,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            sendproto64
        ],
        [
            respguid,
            null,
            null,
            null,
            null,
            respauth,
            JsonFunctions.dateObj
        ],
        null,
        86400000000,
        null,
        null,
        null,
        []
        ];

        return resjson;
    }

    static GetRefreshTokenJSON(guid, oldtachyon, bugle, unixtimestamp, signedcode) {
        var json = [
            [
            guid,null,null,null,null,
            oldtachyon,
            JsonFunctions.dateObj
            ],
            bugle,
            unixtimestamp,
            signedcode,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
                null,
            [null,null,null,null,null,null,null,null,[]
            ]
            ,
            null
            ,
            null,2];

            return json;
    }

}