"use strict";
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
                    var buffer;
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
                var buffer;
                buffer = [];
                const req = https.request(options, (res) => {
                    var gunzip = zlib.createGunzip();
                    res.pipe(gunzip);
                    gunzip.on('data', function (data) {
                        buffer.push(data);
                    }).on("error", function (e) {
                        reject(e);
                    });
                    gunzip.on('end', () => {
                        resolve(Buffer.concat(buffer));
                    });
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
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
                const req = https.request(options, (res) => {
                    var buffers;
                    buffers = [];
                    res.on('data', (d) => {
                        buffers.push(d);
                    });
                    res.on('end', () => {
                        resolve(Buffer.concat(buffers));
                    });
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
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
                var buffer;
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
                                    resolve(corrresp);
                                }
                                ;
                            }
                        });
                    }).on('end', () => {
                        reject("Ended connection");
                    }).on("error", function (e) {
                        reject(e);
                    });
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
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
                var buffer;
                buffer = [];
                const req = https.request(options, (res) => {
                    var gunzip = zlib.createGunzip();
                    res.pipe(gunzip);
                    gunzip.on('data', function (data) {
                        buffer.push(data.toString());
                    }).on("error", function (e) {
                        reject(e);
                    });
                    gunzip.on('end', () => {
                        resolve(buffer.join(""));
                    });
                });
                this.AllReqs.push(req);
                req.on('error', (error) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaHR0cHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQStCO0FBQy9CLDZCQUE4QjtBQUU5QixNQUFhLGFBQWE7SUFJdEIsTUFBTSxDQUFPLGFBQWE7O1lBQ3RCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBRW5DLE1BQU0sT0FBTyxHQUFHO29CQUNaLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLE1BQU0sRUFBRSxLQUFLO29CQUNiLElBQUksRUFBRSxxQkFBcUI7b0JBQzNCLE9BQU8sRUFBRTt3QkFDTCxXQUFXLEVBQUUsa0VBQWtFO3dCQUMvRSxrQkFBa0IsRUFBRSxJQUFJO3dCQUN4QixZQUFZLEVBQUUseUdBQXlHO3dCQUN2SCwyQkFBMkIsRUFBRSxHQUFHO3FCQUNuQztpQkFDQSxDQUFBO2dCQUVELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQzNDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDZCxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNqQixJQUFJLElBQUksQ0FBQyxDQUFDO29CQUNkLENBQUMsQ0FBQyxDQUFDO29CQUNILEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFdkIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFD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