const fs = require('fs');
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs');

simdui = null;

function generateUUID() {
    let Yi = function () {
        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
    };

    let Zi = function () {
        return Yi() + Yi() + "-" + Yi() + "-" + Yi() + "-" + Yi() + "-" + Yi() + Yi() + Yi();
    };

    let a = Zi().split("-")[0];

    var c = Zi().split("-"), b = c.pop();
    c.push(b.substring(0, 4) + a);

    var fullid = c.join("-");
    if(simdui == null) 
    {
        simdui = fullid.slice(-8);
    } else {
        fullid = fullid.slice(0, -8) + simdui
    }

    return fullid;
}

function combineByteArrays(array1, array2, array3) {
    const combinedLength = array1.length + array2.length + array3.length;
    const combinedArray = new Uint8Array(combinedLength);
  
    combinedArray.set(array1, 0);
    combinedArray.set(array2, array1.length);
    combinedArray.set(array3, array1.length + array2.length);
  
    return combinedArray;
}

function ArrayFromKey(pubkey) {
    var con1t = base64ToByteArray(pubkey.x);
    var con2t = base64ToByteArray(pubkey.y);
    var newtemm = combineByteArrays(new Uint8Array([4]), con1t, con2t);
    return newtemm;
}

function getResponseBuffer(httpresp) {
    var buff = Buffer.from(httpresp);
    buff = buff.slice(0, buff.length - 8);
    buff = buff.slice(15);
    return buff;
}

function GetGoogleApiFromHtml(html) {
    var reg = /(A16fYe\\x22,\\x5bnull,null,\\x22)(?<GoogleApi>.*?)(\\x22\\x5d\\x5d)/;
    var googleapi = html.match(reg).groups.GoogleApi;
    return googleapi;
}

function readFile(filePath) {
    try {
        var sessionDataStr; sessionDataStr = readFileSync(filePath);
        var sessionData = JSON.parse(sessionDataStr);
        return sessionData;
    } catch { }
    return null;
  }

function fileExists(filePath) {
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

function base64ToByteArray(base64String) {
    const normalizedBase64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
    const decodedString = atob(normalizedBase64);
    const byteArray = new Uint8Array(decodedString.length);
    
    for (let i = 0; i < decodedString.length; i++) {
      byteArray[i] = decodedString.charCodeAt(i);
    }
    
    return byteArray;
}

function GetdateFromExp(d) {
    var expiredate = d / 60000000;

    var d1 = new Date (),
    d2 = new Date ( d1 );
    d2.setMinutes ( d1.getMinutes() + expiredate - 60 );
    return d2;
}


module.exports = {
    generateUUID,
    combineByteArrays,
    base64ToByteArray,
    GetGoogleApiFromHtml,
    ArrayFromKey,
    getResponseBuffer,
    GetdateFromExp,
    fileExists,
    readFile
};