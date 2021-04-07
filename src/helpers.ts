const { subtle } = require('crypto').webcrypto;
const Blob = require('cross-blob');
import * as crypto from 'crypto';

export class HelperFunctions {

    static ProcessConvData(data) {
        var datare = {
            ConvId : data[0],
            ConvName : data[1],
            LastMsgId : data[16],
            UserId : data[10],
            LastMsgTimeStamp: data[4],
            Recipients: HelperFunctions.ProcessRecipients(data[19]),
            Avatar: data[8] ? Buffer.from(data[8][2]).toString('base64') : null
        };

        return datare;
    }

    private static ProcessRecipients(recips) {
        var recipsReturn; recipsReturn = [];
        for(var r in recips) {
            var re = recips[r];
            if(re[0][1]) {
                recipsReturn.push({
                    Id : re[0][2],
                    Number : re[0][1],
                });
            }
        }

        return recipsReturn;
    }

    static ProcessMsgData(data, tempIdsSending) {
        var datare = {
            MsgId : data[0],
            MsgTimeStamp: data[4],
            ConvId: data[6],
            UserId: data[8],
            TempId: data[11],
            MsgText: data[9][0][1] ? data[9][0][1][0] : null,
            MsgSubject: data[9][1] ? (data[9][1][1] ? data[9][1][1][0] : null) : null,
            ImageData: data[9][0][2],
            StatusId: data[3][1],
            StatusText: data[3][4],
            MsgSentByUser: (data[3][1] == "1" || data[3][1] == "8" || data[3][1] == "205") ? true : false,
            SentByClient: false
        }

        if(datare.MsgText == null) {
            datare.ImageData[6] = Buffer.from(datare.ImageData[6]).toString('base64');
            datare.ImageData[10] = Buffer.from(datare.ImageData[10]).toString('base64');
            datare.ImageData[11] = Buffer.from(datare.ImageData[11]).toString('base64');
        }

        if (tempIdsSending.indexOf(datare.TempId) >= 0) {
            datare.SentByClient = true;
        }

        return datare;
    }

    static async DeCryptMessage2(message, crypto_msg_enc_key) {

        var a = message;

        var key = await subtle.importKey("raw", crypto_msg_enc_key, {
            name: "AES-CTR",
            length: crypto_msg_enc_key.length
        }, !1, ["encrypt", "decrypt"])

        var c;

        if (48 > a.length)
            throw new RangeError("hc");
        if (null != c)
            throw Error("ic");
        c = new Uint8Array(Array.prototype.slice.call(a, 0, a.length - 32));
        a = new Uint8Array(Array.prototype.slice.call(a, c.length));
        a = new Uint8Array(Array.prototype.slice.call(c, c.length - 16));
        c = new Uint8Array(Array.prototype.slice.call(c, 0, c.length - 16));

        const b = new Uint8Array(16);
        b.set(a);
        let d;
        d = await subtle.decrypt({
            name: "AES-CTR",
            counter: b,
            length: 128
        }, key, c);
        return new Uint8Array(d)
    }

    static async EncryptMessage(message, crypto_msg_enc_key, crypto_msg_hmac) {

        message = new Uint8Array(message);
        crypto_msg_enc_key = Buffer.from(crypto_msg_enc_key, 'base64')
        crypto_msg_hmac = Buffer.from(crypto_msg_hmac, 'base64')

        var key = await subtle.importKey("raw", crypto_msg_enc_key, {
            name: "AES-CTR",
            length: crypto_msg_enc_key.length
        }, !1, ["encrypt", "decrypt"]);

        var hmac = await subtle.importKey("raw", crypto_msg_hmac, {
            name: "HMAC",
            hash: {
                name: "SHA-256"
            },
            length: 8 * crypto_msg_hmac.length
        }, !1, ["sign", "verify"]);

        var a = message;

        var c = crypto.randomFillSync(new Uint8Array(16));
        const b = new Uint8Array(16);
        b.set(c);
        var d;
        d = await subtle.encrypt({
            name: "AES-CTR",
            counter: b,
            length: 128
        }, key, a);

        a = await HelperFunctions.li([new Uint8Array(d), c]);
        d = await HelperFunctions.fw(hmac, a);
        if (32 != d.length)
            throw Error("gc`" + d.length);
        return await HelperFunctions.li([a, d]);
    }

    static async li(a) {
        var c; c = 0;
        for (var b of a)
            c += b.length;
        c = new Uint8Array(c);
        b = 0;
        for (const d of a)
            c.set(d, b),
            b += d.length;
        return c
    }

    static async fw(hmac, a) {
        const b = await subtle.sign({
            name: "HMAC",
            hash: {
                name: "SHA-256"
            }
        }, hmac, a);
        return new Uint8Array(b.slice(0, 32))
    }

    static getResponseBuffer(httpresp) {
        var buff = Buffer.from(httpresp);
        var base64string = buff.toString('base64');
        var finalistring = base64string.substring(20, base64string.length - 12);
        if(finalistring.startsWith("Cgo")) {
            finalistring = finalistring.substring(0, finalistring.length - 1) + "=";
        }

        return finalistring;
    }

    static groupBy2(xs, prop) {
        var grouped = {};
        for (var i=0; i<xs.length; i++) {
            var p = xs[i][prop];
            if (!grouped[p]) { grouped[p] = []; }
            grouped[p].push(xs[i]);
        }
        return grouped;
    }

    static async getKeys() {
        var crypto_msg_enc_key = new Uint8Array(32);
        var crypto_msg_hmac = new Uint8Array(32);
        crypto.randomFillSync(crypto_msg_enc_key);
        crypto.randomFillSync(crypto_msg_hmac);

        var ECDSA_Keys = await subtle.generateKey({
            name: "ECDSA",
            namedCurve: "P-256"
        }, true, ["sign"]);

        return {
            crypto_msg_enc_key,
            crypto_msg_hmac,
            ECDSA_Keys
        }
    }

    static async GetRefreshToken(privkey, pubkey, refreqid, utimestamp) {

        var privkeysjson = Buffer.from(privkey, 'base64').toString();
        var privobj = JSON.parse(privkeysjson);

        var pubkeysjson = Buffer.from(pubkey, 'base64').toString();
        var pubobj = JSON.parse(pubkeysjson);

        var keydata = {
            kty: "EC",
            crv: "P-256",
            x: pubobj.x,
            y: pubobj.y,
            d: privobj.d
        };

        const blobb = new Blob([`${refreqid}:${utimestamp}`]);
        const arrbuffer = await blobb.arrayBuffer()
        const blogbuff = Buffer.from(arrbuffer);
        const d = new Uint8Array(blogbuff);

        var mykeysign = await subtle.importKey("jwk", keydata, {
            name: "ECDSA",
            namedCurve: "P-256"
        }, !0, ["sign"]);

        var msgsign = await subtle.sign({
            name: "ECDSA",
            hash: {
                name: "SHA-256"
            }
        }, mykeysign, d);

        var b64sign = new Uint8Array(msgsign); 
        b64sign = HelperFunctions.EncodeUINT(msgsign);
        var encstr = Buffer.from(b64sign).toString('base64');

        return encstr;
    }

    static Oha = function(a) {
        let c = 0;
        for (; c < a.length && 0 == a[c]; )
            c++;
        c == a.length && (c = a.length - 1);
        let b = 0;
        128 == (a[c] & 128) && (b = 1);
        const d = new Uint8Array(a.length - c + b);
        d.set(a.subarray(c), b);
        return d
    }

    static EncodeUINT(c) {
        var b = new Uint8Array(c);
        if (0 != b.length % 2 || 0 == b.length || 132 < b.length)
            throw "Invalid IEEE P1363 signature encoding. Length: " + b.length;
        c = HelperFunctions.Oha(b.subarray(0, b.length / 2));
        b = HelperFunctions.Oha(b.subarray(b.length / 2, b.length));
        let d = 0;
        const e = c.length + 4 + b.length;
        let f;
        128 <= e ? (f = new Uint8Array(e + 3),
        f[d++] = 48,
        f[d++] = 129) : (f = new Uint8Array(e + 2),
        f[d++] = 48);
        f[d++] = e;
        f[d++] = 2;
        f[d++] = c.length;
        f.set(c, d);
        d += c.length;
        f[d++] = 2;
        f[d++] = b.length;
        f.set(b, d);
        c = f

        return c;
    }
}