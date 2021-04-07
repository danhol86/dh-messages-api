"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9qc29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQWEsYUFBYTtJQUl0QixNQUFNLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNO1FBQzlDLElBQUksUUFBUSxHQUFHLENBQUM7Z0JBQ1osS0FBSztnQkFDTCxJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLEdBQUc7Z0JBQ0gsYUFBYSxDQUFDLE9BQU87YUFDeEIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNO1FBQ3ZELElBQUksT0FBTyxHQUFJLENBQUM7Z0JBQ1osT0FBTztnQkFDUCxJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLEdBQUc7Z0JBQ0gsYUFBYSxDQUFDLE9BQU87YUFDeEIsRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEVBQUU7U0FFZCxDQUFDO1FBRUYsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXO1FBRW5FLElBQUksT0FBTyxHQUFJLENBQUMsS0FBSztZQUNyQjtnQkFDSSxRQUFRO2dCQUNSLEVBQUU7Z0JBQ0YsSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osV0FBVzthQUNkO1lBQ0Q7Z0JBQ0ksUUFBUTtnQkFDUixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLFFBQVE7Z0JBQ1IsYUFBYSxDQUFDLE9BQU87YUFDeEI7WUFDRCxJQUFJO1lBQ0osV0FBVztZQUNYLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLEVBQUU7U0FDRCxDQUFDO1FBRUYsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsVUFBVTtRQUN6RSxJQUFJLElBQUksR0FBRztZQUNQO2dCQUNBLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJO2dCQUN4QixVQUFVO2dCQUNWLGFBQWEsQ0FBQyxPQUFPO2FBQ3BCO1lBQ0QsS0FBSztZQUNMLGFBQWE7WUFDYixVQUFVO1lBQ1YsSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNBLElBQUk7WUFDUixDQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsRUFBRTthQUMxQztZQUVELElBQUk7WUFFSixJQUFJLEVBQUMsQ0FBQztTQUFDLENBQUM7UUFFUixPQUFPLElBQUksQ0FBQztJQUNwQixDQUFDOztBQWpHTCxzQ0FtR0M7QUFqR1UscUJBQU8sR0FBRyxDQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMifQ==