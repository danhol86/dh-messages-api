package messages

import (
	"encoding/json"
)

func getRecMessagesStringJSON(reqid string, b64 string) string {
	dateObj := []interface{}{nil, nil, 2021, 2, 15, nil, 4, nil, 6}

	reqdata1 := [][]interface{}{
		{
			reqid,
			nil,
			nil,
			nil,
			nil,
			b64,
			dateObj,
		},
	}

	jsonData, _ := json.Marshal(reqdata1)

	return string(jsonData)
}

func GetRefreshTokenJSON(guid, oldtachyon string, bugle UserScan_UserScanData_BugleScheme, unixtimestamp int64, signedcode interface{}) []interface{} {

	bugleobj := []interface{}{bugle.BugleId, bugle.BugleNum, bugle.Bugle}

	dateObj := []interface{}{nil, nil, 2021, 2, 15, nil, 4, nil, 6}

	json := []interface{}{
		[]interface{}{
			guid,
			nil,
			nil,
			nil,
			nil,
			oldtachyon,
			dateObj,
		},
		bugleobj,
		unixtimestamp,
		signedcode,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		[]interface{}{
			nil,
			nil,
			nil,
			nil,
			nil,
			nil,
			nil,
			nil,
			[]interface{}{},
		},
		nil,
		nil,
		2,
	}

	return json
}
