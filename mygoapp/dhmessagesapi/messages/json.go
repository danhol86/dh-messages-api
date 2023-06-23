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

func getAckMessagesStringJSON(newguid string, guids []string, n64 string) (string, error) {
	dateObj := []interface{}{nil, nil, 2021, 2, 15, nil, 4, nil, 6}

	resjson := []interface{}{
		[]interface{}{
			newguid,
			nil,
			nil,
			nil,
			nil,
			n64,
			dateObj,
		},
		guids,
		nil,
		[]interface{}{},
	}

	jsonData, err := json.Marshal(resjson)
	if err != nil {
		return "", err
	}

	return string(jsonData), nil
}

func GetRefreshTokenJSON(guid, oldtachyon string, BugleId int32, BugleNum string, Bugle string, unixtimestamp int64, signedcode interface{}) []interface{} {

	bugleobj := []interface{}{BugleId, BugleNum, Bugle}

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

func getSendMessagesStringJSON(BugleId int32, BugleNum string, Bugle string, respguid, respauth, sendproto64 string) (string, error) {

	bugleobj := []interface{}{BugleId, BugleNum, Bugle}
	dateObj := []interface{}{nil, nil, 2021, 2, 15, nil, 4, nil, 6}
	resjson := []interface{}{
		bugleobj,
		[]interface{}{
			respguid,
			19,
			nil,
			nil,
			nil,
			nil,
			nil,
			nil,
			nil,
			nil,
			nil,
			sendproto64,
		},
		[]interface{}{
			respguid,
			nil,
			nil,
			nil,
			nil,
			respauth,
			dateObj,
		},
		nil,
		86400000000,
		nil,
		nil,
		nil,
		[]interface{}{},
	}

	resjsonBytes, err := json.Marshal(resjson)
	if err != nil {
		return "", err
	}

	return string(resjsonBytes), nil
}
