"use strict";
//all json objects used by protobuf. not sure on how numbers generated e.g. 2021 im assuming year, but doesnt seem to affect the calls.
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFunctions = void 0;
class JsonFunctions {
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
        var resjson = [[
                newguid,
                null,
                null,
                null,
                null,
                n64,
                JsonFunctions.dateObj
            ], guids, null, []
        ];
        return resjson;
    }
    static getSendMessagesStringJSON(bugle, respguid, respauth, sendproto64) {
        var resjson = [bugle,
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
                guid, null, null, null, null,
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
            [null, null, null, null, null, null, null, null, []
            ],
            null,
            null, 2
        ];
        return json;
    }
}
exports.JsonFunctions = JsonFunctions;
JsonFunctions.dateObj = [null, null, 2021, 2, 15, null, 4, null, 6];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9qc29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1SUFBdUk7OztBQUV2SSxNQUFhLGFBQWE7SUFJdEIsTUFBTSxDQUFDLHdCQUF3QixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTTtRQUM5QyxJQUFJLFFBQVEsR0FBRyxDQUFDO2dCQUNaLEtBQUs7Z0JBQ0wsSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixHQUFHO2dCQUNILGFBQWEsQ0FBQyxPQUFPO2FBQ3hCLENBQUMsQ0FBQztRQUVILE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxNQUFNLENBQUMsd0JBQXdCLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTTtRQUN2RCxJQUFJLE9BQU8sR0FBSSxDQUFDO2dCQUNaLE9BQU87Z0JBQ1AsSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixHQUFHO2dCQUNILGFBQWEsQ0FBQyxPQUFPO2FBQ3hCLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxFQUFFO1NBRWQsQ0FBQztRQUVGLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFRCxNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVztRQUVuRSxJQUFJLE9BQU8sR0FBSSxDQUFDLEtBQUs7WUFDckI7Z0JBQ0ksUUFBUTtnQkFDUixFQUFFO2dCQUNGLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLFdBQVc7YUFDZDtZQUNEO2dCQUNJLFFBQVE7Z0JBQ1IsSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixRQUFRO2dCQUNSLGFBQWEsQ0FBQyxPQUFPO2FBQ3hCO1lBQ0QsSUFBSTtZQUNKLFdBQVc7WUFDWCxJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixFQUFFO1NBQ0QsQ0FBQztRQUVGLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFVBQVU7UUFDekUsSUFBSSxJQUFJLEdBQUc7WUFDUDtnQkFDQSxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSTtnQkFDeEIsVUFBVTtnQkFDVixhQUFhLENBQUMsT0FBTzthQUNwQjtZQUNELEtBQUs7WUFDTCxhQUFhO1lBQ2IsVUFBVTtZQUNWLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDQSxJQUFJO1lBQ1IsQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLEVBQUU7YUFDMUM7WUFFRCxJQUFJO1lBRUosSUFBSSxFQUFDLENBQUM7U0FBQyxDQUFDO1FBRVIsT0FBTyxJQUFJLENBQUM7SUFDcEIsQ0FBQzs7QUFqR0wsc0NBbUdDO0FBakdVLHFCQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDIn0=