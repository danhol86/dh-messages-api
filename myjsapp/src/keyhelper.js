const crypto = require("crypto");
const { subtle } = require('crypto').webcrypto;

var getKeys = async function(pro) {
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

var GetRefreshToken = async function(privkey, pubkey, refreqid, utimestamp) {

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

    const text = `${refreqid}:${utimestamp}`;
    const encoder = new TextEncoder();
    const arrbuffer = encoder.encode(text).buffer;

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

    var b64sign = EncodeUINT(msgsign);
    var encstr = Buffer.from(b64sign).toString('base64');

    return encstr;
}

var Oha = function(a) {
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

var EncodeUINT = function(c) {
    var b = new Uint8Array(c);
    if (0 != b.length % 2 || 0 == b.length || 132 < b.length)
        throw "Invalid IEEE P1363 signature encoding. Length: " + b.length;
    c = Oha(b.subarray(0, b.length / 2));
    b = Oha(b.subarray(b.length / 2, b.length));
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

var GetEncryptionData = async function (webenc) { 
    var bweb = Buffer.from(webenc);
    var uint = new Uint8Array(bweb);

    var decpart1 = uint.slice(0,15);
    var decpart2 = uint.slice(15,47);

    var subk = decpart2.slice(0, 16);

    var k1k = Buffer.from(subk).toString('base64');

    var b = {
        kty: "oct",
        k: k1k,
        alg: "A128GCM",
        ext: !0
    };

    return await subtle.importKey("jwk", b, {
        name: "AES-GCM"
    }, !1, ["encrypt", "decrypt"]);
}

var getKeyData = async function () { 
    sessionData = {};
    var keys; keys = await getKeys();
    sessionData.crypto_msg_enc_key = Buffer.from(keys.crypto_msg_enc_key).toString('base64');
    sessionData.crypto_msg_hmac = Buffer.from(keys.crypto_msg_hmac).toString('base64');
    var pubkeyexp = await subtle.exportKey("jwk", keys.ECDSA_Keys.publicKey);
    var privkeyexp = await subtle.exportKey("jwk", keys.ECDSA_Keys.privateKey);
    sessionData.pubkeyexp = pubkeyexp;
    sessionData.privkeyexp = privkeyexp;
    sessionData.crypto_pub_key = Buffer.from(JSON.stringify(pubkeyexp)).toString('base64');
    sessionData.crypto_pri_key = Buffer.from(JSON.stringify(privkeyexp)).toString('base64');
    return sessionData;
}

var EncryptMessage = async function (message, crypto_msg_enc_key, crypto_msg_hmac) { 

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

    a = await li([new Uint8Array(d), c]);
    d = await fw(hmac, a);
    if (32 != d.length)
        throw Error("gc`" + d.length);
    return await li([a, d]);
}

 async function li(a) {
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

async function fw(hmac, a) {
    const b = await subtle.sign({
        name: "HMAC",
        hash: {
            name: "SHA-256"
        }
    }, hmac, a);
    return new Uint8Array(b.slice(0, 32))
}

async function DeCryptMessage2(message, crypto_msg_enc_key) {

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


module.exports = {
    getKeyData,
    GetEncryptionData,
    EncryptMessage,
    DeCryptMessage2,
    GetRefreshToken
}