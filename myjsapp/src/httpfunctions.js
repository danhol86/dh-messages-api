const https = require("https");
const zlib = require("zlib");

var httpGetGoogle = async function(mybarray, code) {
    return new Promise((resolve, reject) => {

        const options = {
            hostname: 'messages.google.com',
            method: 'GET',
            path: "/web/authentication",
            headers: {
                'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': '(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
                'Upgrade-Insecure-Requests': "1"
            },
            }
            let body = '';

            const req = https.request(options, (res) => {
            
            res.on('data', (d) => {  
                body += d;
            });
            res.on('end', () => resolve(body));
            });
 
            req.on('error', (error) => {
                body = '';
                reject(error);
            })

            req.end()
    });
};

var httpPostPhoneRelay = async function(data, googleapi) {
    return new Promise((resolve, reject) => {

        const options = {
            hostname: 'instantmessaging-pa.googleapis.com',
            method: 'POST',
            gzip: true,
            path: "/$rpc/google.internal.communications.instantmessaging.v1.Pairing/RegisterPhoneRelay",
            headers: {

                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "x-goog-api-key": googleapi,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
                "x-user-agent": "grpc-web-javascript/0.1",
                "referer": "https://messages.google.com/",
                "origin": "https://messages.google.com",
                "content-type" : "application/x-protobuf"
            },
            }

            let buffers;
            buffers = [];
            
            const req = https.request(options, (res) => {
                res.on('data', (d) => {  
                    buffers.push(d);
                });
                res.on('end', () => {
                    let dres = Buffer.concat(buffers);
                    buffers = null;
                    resolve(dres);
                });
            })

            req.on('error', (error) => {
                buffers = null;
                reject(error);
            })

            req.write(data);

            req.end()
    });
};

var httpPostWebEnc = async function(data, googleapi) {
    return new Promise((resolve, reject) => {

        const options = {
            hostname: 'instantmessaging-pa.googleapis.com',
            method: 'POST',
            gzip: true,
            path: "/$rpc/google.internal.communications.instantmessaging.v1.Pairing/GetWebEncryptionKey",
            headers: {

                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "x-goog-api-key": googleapi,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
                "x-user-agent": "grpc-web-javascript/0.1",
                "referer": "https://messages.google.com/",
                "origin": "https://messages.google.com",
                "content-type" : "application/x-protobuf"
            },
            }
            
            let buffer; buffer = [];

            const req = https.request(options, (res) => {

                var gunzip = zlib.createGunzip();            
                res.pipe(gunzip);

                gunzip.on('data', function(data) {
                    buffer.push(data);
                }).on("error", function(e) {
                    buffer = null;
                    reject(e);
                });

                gunzip.on('end', () => {
                    let dres = Buffer.concat(buffer);
                    buffer = null;
                    resolve(dres);
                });
            })
            
            req.on('error', (error) => {
                buffer = null;
                reject(error);
            })

            req.write(data);

            req.end()
    });
}

var httpPostNewMessages = async function(jsondata, googleapi, callback) {
    return new Promise((resolve, reject) => {
        const options = {
          hostname: 'instantmessaging-pa.googleapis.com',
          method: 'POST',
          gzip: true,
          path: '/$rpc/google.internal.communications.instantmessaging.v1.Messaging/ReceiveMessages',
          headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'x-goog-api-key': googleapi,
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
            'x-user-agent': 'grpc-web-javascript/0.1',
            referer: 'https://messages.google.com/',
            origin: 'https://messages.google.com',
            'content-type': 'application/json+protobuf'
          }
        };
    
        let buffer = [];
        let destroyed = false; // Flag to track request destruction

        const req = https.request(options, (res) => {
          const gunzip = zlib.createGunzip();
          res.pipe(gunzip);
    
          gunzip.on('data', async function (data) {

            if (destroyed) {
                return;
              }

            buffer.push(data.toString());
            const ald = buffer.join('');

            if (ald.endsWith("]".repeat(2))) {
              var newmess = ald;
              buffer = [];
              buffer.push("[[[]");


              if (ald.endsWith("]".repeat(3))) {
                newmess = newmess + "]";
              } else if (ald.endsWith("]".repeat(2))) {
                newmess = newmess + "]]";
              }

              if(newmess == "[[[]]]]") return;

              try {
                var nrespd = JSON.parse(newmess);
                const resp = await callback(nrespd);
              } catch(e) {
                console.log("No!");
              }
            } else if (ald.endsWith("]".repeat(2))) {
              console.log("No!");
            }
          })
            .on('end', () => {
              buffer = null;
              reject('Ended connection');
            })
            .on('finish', () => {
                var alldsent = true;
                var df = [];
            })
            .on('error', function (e) {
              buffer = null;
              reject(e);
            });
        });
    
        req.on('error', (error) => {
          buffer = null;
          reject(error);
        });
    
        req.write(jsondata);
    
        req.end();
      });
};


var httpPostRecMessages = async function(jsondata, googleapi, callback) {
    return new Promise((resolve, reject) => {
        const options = {
          hostname: 'instantmessaging-pa.googleapis.com',
          method: 'POST',
          gzip: true,
          path: '/$rpc/google.internal.communications.instantmessaging.v1.Messaging/ReceiveMessages',
          headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'x-goog-api-key': googleapi,
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
            'x-user-agent': 'grpc-web-javascript/0.1',
            referer: 'https://messages.google.com/',
            origin: 'https://messages.google.com',
            'content-type': 'application/json+protobuf'
          }
        };
    
        let buffer = [];
        let destroyed = false; // Flag to track request destruction

        const req = https.request(options, (res) => {
          const gunzip = zlib.createGunzip();
          res.pipe(gunzip);
    
          gunzip.on('data', async function (data) {

            if (destroyed) {
                return;
              }

            buffer.push(data.toString());
            const ald = buffer.join('');
    
            const corrresp = CorrectResponse(ald);
            if (corrresp != null) {
              const resp = await callback(corrresp);
              if (resp === true) {
                req.destroy();
                destroyed = true; // Set the destroyed flag
                buffer = null;
                resolve(corrresp);
              }
            }
          })
            .on('end', () => {
              buffer = null;
              reject('Ended connection');
            })
            .on('error', function (e) {
              buffer = null;
              reject(e);
            });
        });
    
        req.on('error', (error) => {
          buffer = null;
          reject(error);
        });
    
        req.write(jsondata);
    
        req.end();
      });
};

var httpPostAckMessages = async function(path, jsondata, googleapi) {
    return new Promise((resolve, reject) => {

        const options = {
            hostname: 'instantmessaging-pa.googleapis.com',
            method: 'POST',
            gzip: true,
            path: path,
            headers: {

                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "x-goog-api-key": googleapi,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
                "x-user-agent": "grpc-web-javascript/0.1",
                "referer": "https://messages.google.com/",
                "origin": "https://messages.google.com",
                "content-type" : "application/json+protobuf"
            },
        }
            
        let buffer; buffer = [];

        const req = https.request(options, (res) => {

            var gunzip = zlib.createGunzip();            
            res.pipe(gunzip);

            gunzip.on('data', function(data) {
                buffer.push(data.toString());
            }).on("error", function(e) {
                buffer = null;
                reject(e);
            });

            gunzip.on('end', () => {
                let dret = buffer.join("");
                buffer = null;
                resolve(dret);
            });
        })

        req.on('error', (error) => {
            buffer = null;
            reject(error);
        })

        req.write(jsondata);

        req.end()
    });
};  

function CorrectResponse(httpresprec) {
    if(httpresprec.substring(0,1) == ",") {
        httpresprec = httpresprec.substring(1);
    }
    var respd = CResp(httpresprec);
    if(!respd) {
        respd = CResp(httpresprec + "\"");
    }

    return respd;
}

function CResp(httpresprec) {
    var respd;
    for(var i = 0; i < 20; i++) {
        try {
            respd = JSON.parse(httpresprec);
            break;
        } catch 
        {
            httpresprec = httpresprec + "]";
        }
    }   

    for(var i = 0; i < 40; i++) {
        try {
            respd = JSON.parse(httpresprec);
            break;
        } catch 
        {
            httpresprec = "[" + httpresprec;
        }
    }  

    return respd;
}

module.exports = {
    GetGoogle : httpGetGoogle,
    PostPhoneRelay : httpPostPhoneRelay,
    httpPostRecMessages,
    httpPostWebEnc,
    httpPostAckMessages,
    httpPostNewMessages
}