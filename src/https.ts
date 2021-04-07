//all http calls made by the api. refactor required 

import * as https from 'https';
import * as zlib  from 'zlib';

export class HttpFunctions {

    static AllReqs: any[] = [];

    static async httpGetGoogle() {
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
                
                const req = https.request(options, (res) => {
                var body = '';
                res.on('data', (d) => {  
                    body += d;
                });
                res.on('end', () => resolve(body));
                });

                this.AllReqs.push(req);
                
                req.on('error', (error) => {
                    reject(error);
                })

                req.end()
        });
    };

    static async httpGetDownload(googdownloadmeta) {
        return new Promise((resolve, reject) => {

            const options = {
                hostname: 'instantmessaging-pa.googleapis.com',
                method: 'GET',
                path: "/upload",
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
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
                    "referer": "https://messages.google.com/",
                    "origin": "https://messages.google.com",
                    "x-goog-download-metadata": googdownloadmeta,
                },
                }
                
                const req = https.request(options, (res) => {
                var buffer; buffer = [];
                res.on('data', (d) => {  
                    buffer.push(d);
                });
                res.on('end', () => resolve(Buffer.concat(buffer)));
                });

                this.AllReqs.push(req);
                
                req.on('error', (error) => {
                    reject(error);
                })

                req.end()
        });
    };

    static async httpPostWebEnc(data, googleapi) {
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
                
                var buffer; buffer = [];

                const req = https.request(options, (res) => {

                    var gunzip = zlib.createGunzip();            
                    res.pipe(gunzip);

                    gunzip.on('data', function(data) {
                        buffer.push(data);
                    }).on("error", function(e) {
                        reject(e);
                    });

                    gunzip.on('end', () => {
                        resolve(Buffer.concat(buffer));
                    });
                })
                
                this.AllReqs.push(req);

                req.on('error', (error) => {
                    reject(error);
                })

                req.write(data);

                req.end()
        });
    };

    static async httpPostPhoneRelay(data, googleapi) {
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
                
                const req = https.request(options, (res) => {
                var buffers;
                buffers = [];
                res.on('data', (d) => {  
                    buffers.push(d);
                });
                res.on('end', () => {
                    resolve(Buffer.concat(buffers));
                });
                })
                
                this.AllReqs.push(req);

                req.on('error', (error) => {
                    reject(error);
                })

                req.write(data);

                req.end()
        });
    };

    static CResp(httpresprec) {
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

    static CorrectResponse(httpresprec) {
        if(httpresprec.substring(0,1) == ",") {
            httpresprec = httpresprec.substring(1);
        }
        var respd = HttpFunctions.CResp(httpresprec);
        if(!respd) {
            respd = HttpFunctions.CResp(httpresprec + "\"");
        }

        return respd;
    }

    static async httpPostRecMessages(jsondata, googleapi, callback) {
        return new Promise((resolve, reject) => {

            const options = {
                hostname: 'instantmessaging-pa.googleapis.com',
                method: 'POST',
                gzip: true,
                path: "/$rpc/google.internal.communications.instantmessaging.v1.Messaging/ReceiveMessages",
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
                
                var buffer; buffer = [];

                const req = https.request(options, (res) => {

                    var gunzip = zlib.createGunzip();            
                    res.pipe(gunzip);

                    gunzip.on('data', async function(data) {
                        buffer.push(data.toString())
                        var ald = buffer.join("");

                        var corrresp = HttpFunctions.CorrectResponse(ald);
                        if(corrresp != null) {
                            var resp = await callback(corrresp);
                            if(resp == true) {
                                req.destroy();
                                resolve(corrresp);
                            };
                        }                        
                    }).on('end', () => {
                        reject("Ended connection");
                    }).on("error", function(e) {
                        reject(e);
                    });
                })
                
                this.AllReqs.push(req);

                req.on('error', (error) => {
                    reject(error);
                })

                req.write(jsondata);

                req.end()
        });
    };

    static async httpPostAckMessages(path, jsondata, googleapi) {
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
                
            var buffer; buffer = [];

            const req = https.request(options, (res) => {

                var gunzip = zlib.createGunzip();            
                res.pipe(gunzip);

                gunzip.on('data', function(data) {
                    buffer.push(data.toString());
                }).on("error", function(e) {
                    reject(e);
                });

                gunzip.on('end', () => {
                    resolve(buffer.join(""));
                });
            })

            this.AllReqs.push(req);
            
            req.on('error', (error) => {
                reject(error);
            })

            req.write(jsondata);

            req.end()
        });
    };  
}