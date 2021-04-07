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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaHR0cHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG9EQUFvRDs7Ozs7Ozs7Ozs7O0FBRXBELCtCQUErQjtBQUMvQiw2QkFBOEI7QUFFOUIsTUFBYSxhQUFhO0lBSXRCLE1BQU0sQ0FBTyxhQUFhOztZQUN0QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUVuQyxNQUFNLE9BQU8sR0FBRztvQkFDWixRQUFRLEVBQUUscUJBQXFCO29CQUMvQixNQUFNLEVBQUUsS0FBSztvQkFDYixJQUFJLEVBQUUscUJBQXFCO29CQUMzQixPQUFPLEVBQUU7d0JBQ0wsV0FBVyxFQUFFLGtFQUFrRTt3QkFDL0Usa0JBQWtCLEVBQUUsSUFBSTt3QkFDeEIsWUFBWSxFQUFFLHlHQUF5Rzt3QkFDdkgsMkJBQTJCLEVBQUUsR0FBRztxQkFDbkM7aUJBQ0EsQ0FBQTtnQkFFRCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUMzQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ2QsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDakIsSUFBSSxJQUFJLENBQUMsQ0FBQztvQkFDZCxDQUFDLENBQUMsQ0FBQztvQkFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXZCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVGLE1BQU0sQ0FBTyxlQUFlLENBQUMsZ0JBQWdCOztZQUN6QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUVuQyxNQUFNLE9BQU8sR0FBRztvQkFDWixRQUFRLEVBQUUsb0NBQW9DO29CQUM5QyxNQUFNLEVBQUUsS0FBSztvQkFDYixJQUFJLEVBQUUsU0FBUztvQkFDZixPQUFPLEVBQUU7d0JBQ0wsUUFBUSxFQUFFLEtBQUs7d0JBQ2YsaUJBQWlCLEVBQUUsbUJBQW1CO3dCQUN0QyxpQkFBaUIsRUFBRSw0QkFBNEI7d0JBQy9DLGVBQWUsRUFBRSxVQUFVO3dCQUMzQixRQUFRLEVBQUUsVUFBVTt3QkFDcEIsV0FBVyxFQUFFLDhFQUE4RTt3QkFDM0Ysa0JBQWtCLEVBQUUsSUFBSTt3QkFDeEIsZ0JBQWdCLEVBQUUsT0FBTzt3QkFDekIsZ0JBQWdCLEVBQUUsTUFBTTt3QkFDeEIsZ0JBQWdCLEVBQUUsWUFBWTt3QkFDOUIsWUFBWSxFQUFFLHFIQUFxSDt3QkFDbkksU0FBUyxFQUFFLDhCQUE4Qjt3QkFDekMsUUFBUSxFQUFFLDZCQUE2Qjt3QkFDdkMsMEJBQTBCLEVBQUUsZ0JBQWdCO3FCQUMvQztpQkFDQSxDQUFBO2dCQUVELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQzNDLElBQUksTUFBTSxDQUFDO29CQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQ3hCLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7d0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLENBQUMsQ0FBQyxDQUFDO29CQUNILEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXZCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVGLE1BQU0sQ0FBTyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVM7O1lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBRW5DLE1BQU0sT0FBTyxHQUFHO29CQUNaLFFBQVEsRUFBRSxvQ0FBb0M7b0JBQzlDLE1BQU0sRUFBRSxNQUFNO29CQUNkLElBQUksRUFBRSxJQUFJO29CQUNWLElBQUksRUFBRSxzRkFBc0Y7b0JBQzVGLE9BQU8sRUFBRTt3QkFFTCxRQUFRLEVBQUUsS0FBSzt3QkFDZixpQkFBaUIsRUFBRSxtQkFBbUI7d0JBQ3RDLGlCQUFpQixFQUFFLDRCQUE0Qjt3QkFDL0MsZUFBZSxFQUFFLFVBQVU7d0JBQzNCLFFBQVEsRUFBRSxVQUFVO3dCQUNwQixXQUFXLEVBQUUsOEVBQThFO3dCQUMzRixrQkFBa0IsRUFBRSxJQUFJO3dCQUN4QixnQkFBZ0IsRUFBRSxPQUFPO3dCQUN6QixnQkFBZ0IsRUFBRSxNQUFNO3dCQUN4QixnQkFBZ0IsRUFBRSxZQUFZO3dCQUM5QixnQkFBZ0IsRUFBRSxTQUFTO3dCQUMzQixZQUFZLEVBQUUscUhBQXFIO3dCQUNuSSxjQUFjLEVBQUUseUJBQXlCO3dCQUN6QyxTQUFTLEVBQUUsOEJBQThCO3dCQUN6QyxRQUFRLEVBQUUsNkJBQTZCO3dCQUN2QyxjQUFjLEVBQUcsd0JBQXdCO3FCQUM1QztpQkFDQSxDQUFBO2dCQUVELElBQUksTUFBTSxDQUFDO2dCQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBRXhCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBRXZDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFakIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBUyxJQUFJO3dCQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN0QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVMsQ0FBQzt3QkFDckIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNkLENBQUMsQ0FBQyxDQUFDO29CQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTt3QkFDbEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDbkMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXZCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFaEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVGLE1BQU0sQ0FBTyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsU0FBUzs7WUFDM0MsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFFbkMsTUFBTSxPQUFPLEdBQUc7b0JBQ1osUUFBUSxFQUFFLG9DQUFvQztvQkFDOUMsTUFBTSxFQUFFLE1BQU07b0JBQ2QsSUFBSSxFQUFFLElBQUk7b0JBQ1YsSUFBSSxFQUFFLHFGQUFxRjtvQkFDM0YsT0FBTyxFQUFFO3dCQUVMLFFBQVEsRUFBRSxLQUFLO3dCQUNmLGlCQUFpQixFQUFFLG1CQUFtQjt3QkFDdEMsaUJBQWlCLEVBQUUsNEJBQTRCO3dCQUMvQyxlQUFlLEVBQUUsVUFBVTt3QkFDM0IsUUFBUSxFQUFFLFVBQVU7d0JBQ3BCLFdBQVcsRUFBRSw4RUFBOEU7d0JBQzNGLGtCQUFrQixFQUFFLElBQUk7d0JBQ3hCLGdCQUFnQixFQUFFLE9BQU87d0JBQ3pCLGdCQUFnQixFQUFFLE1BQU07d0JBQ3hCLGdCQUFnQixFQUFFLFlBQVk7d0JBQzlCLGdCQUFnQixFQUFFLFNBQVM7d0JBQzNCLFlBQVksRUFBRSxxSEFBcUg7d0JBQ25JLGNBQWMsRUFBRSx5QkFBeUI7d0JBQ3pDLFNBQVMsRUFBRSw4QkFBOEI7d0JBQ3pDLFFBQVEsRUFBRSw2QkFBNkI7d0JBQ3ZDLGNBQWMsRUFBRyx3QkFBd0I7cUJBQzVDO2lCQUNBLENBQUE7Z0JBRUQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDM0MsSUFBSSxPQUFPLENBQUM7b0JBQ1osT0FBTyxHQUFHLEVBQUUsQ0FBQztvQkFDYixHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQixDQUFDLENBQUMsQ0FBQztvQkFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7d0JBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDcEMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXZCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFaEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVztRQUNwQixJQUFJLEtBQUssQ0FBQztRQUNWLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEIsSUFBSTtnQkFDQSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDaEMsTUFBTTthQUNUO1lBQUMsV0FDRjtnQkFDSSxXQUFXLEdBQUcsV0FBVyxHQUFHLEdBQUcsQ0FBQzthQUNuQztTQUNKO1FBRUQsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QixJQUFJO2dCQUNBLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNoQyxNQUFNO2FBQ1Q7WUFBQyxXQUNGO2dCQUNJLFdBQVcsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDO2FBQ25DO1NBQ0o7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxXQUFXO1FBQzlCLElBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFO1lBQ2xDLFdBQVcsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QyxJQUFHLENBQUMsS0FBSyxFQUFFO1lBQ1AsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ25EO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELE1BQU0sQ0FBTyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVE7O1lBQzFELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBRW5DLE1BQU0sT0FBTyxHQUFHO29CQUNaLFFBQVEsRUFBRSxvQ0FBb0M7b0JBQzlDLE1BQU0sRUFBRSxNQUFNO29CQUNkLElBQUksRUFBRSxJQUFJO29CQUNWLElBQUksRUFBRSxvRkFBb0Y7b0JBQzFGLE9BQU8sRUFBRTt3QkFFTCxRQUFRLEVBQUUsS0FBSzt3QkFDZixpQkFBaUIsRUFBRSxtQkFBbUI7d0JBQ3RDLGlCQUFpQixFQUFFLDRCQUE0Qjt3QkFDL0MsZUFBZSxFQUFFLFVBQVU7d0JBQzNCLFFBQVEsRUFBRSxVQUFVO3dCQUNwQixXQUFXLEVBQUUsOEVBQThFO3dCQUMzRixrQkFBa0IsRUFBRSxJQUFJO3dCQUN4QixnQkFBZ0IsRUFBRSxPQUFPO3dCQUN6QixnQkFBZ0IsRUFBRSxNQUFNO3dCQUN4QixnQkFBZ0IsRUFBRSxZQUFZO3dCQUM5QixnQkFBZ0IsRUFBRSxTQUFTO3dCQUMzQixZQUFZLEVBQUUscUhBQXFIO3dCQUNuSSxjQUFjLEVBQUUseUJBQXlCO3dCQUN6QyxTQUFTLEVBQUUsOEJBQThCO3dCQUN6QyxRQUFRLEVBQUUsNkJBQTZCO3dCQUN2QyxjQUFjLEVBQUcsMkJBQTJCO3FCQUMvQztpQkFDQSxDQUFBO2dCQUVELElBQUksTUFBTSxDQUFDO2dCQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBRXhCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBRXZDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFakIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBZSxJQUFJOzs0QkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTs0QkFDNUIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFFMUIsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDbEQsSUFBRyxRQUFRLElBQUksSUFBSSxFQUFFO2dDQUNqQixJQUFJLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQ0FDcEMsSUFBRyxJQUFJLElBQUksSUFBSSxFQUFFO29DQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQ0FDZCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7aUNBQ3JCO2dDQUFBLENBQUM7NkJBQ0w7d0JBQ0wsQ0FBQztxQkFBQSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7d0JBQ2QsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQy9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDO3dCQUNyQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXZCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFcEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVGLE1BQU0sQ0FBTyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVM7O1lBQ3RELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBRW5DLE1BQU0sT0FBTyxHQUFHO29CQUNaLFFBQVEsRUFBRSxvQ0FBb0M7b0JBQzlDLE1BQU0sRUFBRSxNQUFNO29CQUNkLElBQUksRUFBRSxJQUFJO29CQUNWLElBQUksRUFBRSxJQUFJO29CQUNWLE9BQU8sRUFBRTt3QkFFTCxRQUFRLEVBQUUsS0FBSzt3QkFDZixpQkFBaUIsRUFBRSxtQkFBbUI7d0JBQ3RDLGlCQUFpQixFQUFFLDRCQUE0Qjt3QkFDL0MsZUFBZSxFQUFFLFVBQVU7d0JBQzNCLFFBQVEsRUFBRSxVQUFVO3dCQUNwQixXQUFXLEVBQUUsOEVBQThFO3dCQUMzRixrQkFBa0IsRUFBRSxJQUFJO3dCQUN4QixnQkFBZ0IsRUFBRSxPQUFPO3dCQUN6QixnQkFBZ0IsRUFBRSxNQUFNO3dCQUN4QixnQkFBZ0IsRUFBRSxZQUFZO3dCQUM5QixnQkFBZ0IsRUFBRSxTQUFTO3dCQUMzQixZQUFZLEVBQUUscUhBQXFIO3dCQUNuSSxjQUFjLEVBQUUseUJBQXlCO3dCQUN6QyxTQUFTLEVBQUUsOEJBQThCO3dCQUN6QyxRQUFRLEVBQUUsNkJBQTZCO3dCQUN2QyxjQUFjLEVBQUcsMkJBQTJCO3FCQUMvQztpQkFDSixDQUFBO2dCQUVELElBQUksTUFBTSxDQUFDO2dCQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBRXhCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBRXZDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFakIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBUyxJQUFJO3dCQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUNqQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVMsQ0FBQzt3QkFDckIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNkLENBQUMsQ0FBQyxDQUFDO29CQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTt3QkFDbEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDN0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXZCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFcEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7SUFBQSxDQUFDOztBQWhXTixzQ0FpV0M7QUEvVlUscUJBQU8sR0FBVSxFQUFFLENBQUMifQ==