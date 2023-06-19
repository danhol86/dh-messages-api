dateObj = [null,null,2021,2,15,null,4,null,6];

function getRecMessagesStringJSON(reqid, b64, subnum) {
    var reqdata1 = [[
        reqid,
        null,
        null,
        null,
        null,
        b64,
        dateObj
    ]];

    return reqdata1;
}

function getAckMessagesStringJSON(newguid, guids, n64, subnum) { 
    var resjson =  [[
        newguid,
        null,
        null,
        null,
        null,
        n64,
        dateObj
    ],guids,null,[]

    ];

    return resjson;
}

function getSendMessagesStringJSON(bugle, respguid, respauth, sendproto64) { 

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
        dateObj
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

function GetRefreshTokenJSON(guid, oldtachyon, bugle, unixtimestamp, signedcode) {
    var json = [
        [
        guid,null,null,null,null,
        oldtachyon,
        dateObj
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


module.exports = {
    getRecMessagesStringJSON,
    getSendMessagesStringJSON,
    getAckMessagesStringJSON,
    GetRefreshTokenJSON
}