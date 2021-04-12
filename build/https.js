"use strict";
//all http calls made by the api. refactor required 
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
exports.HttpFunctions = void 0;
const https = require("https");
const zlib = require("zlib");
class HttpFunctions {
    static httpGetGoogle() {
        return __awaiter(this, void 0, void 0, function* () {
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
                };
                let body = '';
                const req = https.request(options, (res) => {
                    res.on('data', (d) => {
                        body += d;
                    });
                    res.on('end', () => resolve(body));
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
                    body = '';
                    reject(error);
                });
                req.end();
            });
        });
    }
    ;
    static httpGetDownload(googdownloadmeta) {
        return __awaiter(this, void 0, void 0, function* () {
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
                };
                const req = https.request(options, (res) => {
                    let buffer;
                    buffer = [];
                    res.on('data', (d) => {
                        buffer.push(d);
                    });
                    res.on('end', () => resolve(Buffer.concat(buffer)));
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
                    reject(error);
                });
                req.end();
            });
        });
    }
    ;
    static httpPostWebEnc(data, googleapi) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        "content-type": "application/x-protobuf"
                    },
                };
                let buffer;
                buffer = [];
                const req = https.request(options, (res) => {
                    var gunzip = zlib.createGunzip();
                    res.pipe(gunzip);
                    gunzip.on('data', function (data) {
                        buffer.push(data);
                    }).on("error", function (e) {
                        buffer = null;
                        reject(e);
                    });
                    gunzip.on('end', () => {
                        let dres = Buffer.concat(buffer);
                        buffer = null;
                        resolve(dres);
                    });
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
                    buffer = null;
                    reject(error);
                });
                req.write(data);
                req.end();
            });
        });
    }
    ;
    static httpPostPhoneRelay(data, googleapi) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        "content-type": "application/x-protobuf"
                    },
                };
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
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
                    buffers = null;
                    reject(error);
                });
                req.write(data);
                req.end();
            });
        });
    }
    ;
    static CResp(httpresprec) {
        var respd;
        for (var i = 0; i < 20; i++) {
            try {
                respd = JSON.parse(httpresprec);
                break;
            }
            catch (_a) {
                httpresprec = httpresprec + "]";
            }
        }
        for (var i = 0; i < 40; i++) {
            try {
                respd = JSON.parse(httpresprec);
                break;
            }
            catch (_b) {
                httpresprec = "[" + httpresprec;
            }
        }
        return respd;
    }
    static CorrectResponse(httpresprec) {
        if (httpresprec.substring(0, 1) == ",") {
            httpresprec = httpresprec.substring(1);
        }
        var respd = HttpFunctions.CResp(httpresprec);
        if (!respd) {
            respd = HttpFunctions.CResp(httpresprec + "\"");
        }
        return respd;
    }
    static httpPostRecMessages(jsondata, googleapi, callback) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        "content-type": "application/json+protobuf"
                    },
                };
                let buffer;
                buffer = [];
                const req = https.request(options, (res) => {
                    var gunzip = zlib.createGunzip();
                    res.pipe(gunzip);
                    gunzip.on('data', function (data) {
                        return __awaiter(this, void 0, void 0, function* () {
                            buffer.push(data.toString());
                            var ald = buffer.join("");
                            var corrresp = HttpFunctions.CorrectResponse(ald);
                            if (corrresp != null) {
                                var resp = yield callback(corrresp);
                                if (resp == true) {
                                    req.destroy();
                                    buffer = null;
                                    resolve(corrresp);
                                }
                                ;
                            }
                        });
                    }).on('end', () => {
                        buffer = null;
                        reject("Ended connection");
                    }).on("error", function (e) {
                        buffer = null;
                        reject(e);
                    });
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
                    buffer = null;
                    reject(error);
                });
                req.write(jsondata);
                req.end();
            });
        });
    }
    ;
    static httpPostAckMessages(path, jsondata, googleapi) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        "content-type": "application/json+protobuf"
                    },
                };
                let buffer;
                buffer = [];
                const req = https.request(options, (res) => {
                    var gunzip = zlib.createGunzip();
                    res.pipe(gunzip);
                    gunzip.on('data', function (data) {
                        buffer.push(data.toString());
                    }).on("error", function (e) {
                        buffer = null;
                        reject(e);
                    });
                    gunzip.on('end', () => {
                        let dret = buffer.join("");
                        buffer = null;
                        resolve(dret);
                    });
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
                    buffer = null;
                    reject(error);
                });
                req.write(jsondata);
                req.end();
            });
        });
    }
    ;
}
exports.HttpFunctions = HttpFunctions;
HttpFunctions.AllReqs = [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaHR0cHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG9EQUFvRDs7Ozs7Ozs7Ozs7O0FBRXBELCtCQUErQjtBQUMvQiw2QkFBOEI7QUFFOUIsTUFBYSxhQUFhO0lBSXRCLE1BQU0sQ0FBTyxhQUFhOztZQUN0QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUVuQyxNQUFNLE9BQU8sR0FBRztvQkFDWixRQUFRLEVBQUUscUJBQXFCO29CQUMvQixNQUFNLEVBQUUsS0FBSztvQkFDYixJQUFJLEVBQUUscUJBQXFCO29CQUMzQixPQUFPLEVBQUU7d0JBQ0wsV0FBVyxFQUFFLGtFQUFrRTt3QkFDL0Usa0JBQWtCLEVBQUUsSUFBSTt3QkFDeEIsWUFBWSxFQUFFLHlHQUF5Rzt3QkFDdkgsMkJBQTJCLEVBQUUsR0FBRztxQkFDbkM7aUJBQ0EsQ0FBQTtnQkFDRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBRWQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFFM0MsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDakIsSUFBSSxJQUFJLENBQUMsQ0FBQztvQkFDZCxDQUFDLENBQUMsQ0FBQztvQkFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXZCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3RCLElBQUksR0FBRyxF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