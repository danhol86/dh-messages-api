package messages

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strconv"
	"time"
)

func StartSession(mydata *SessionData) {

	sessionid, err := generateUUID()

	mydata.SessionId = sessionid

	sendmessageid, err := generateUUID()

	getsm1, err := GetSendMessage(mydata.SessionId, sendmessageid, 13, mydata, make([]byte, 0))
	getsm2, err := GetSendMessage(mydata.SessionId, mydata.SessionId, 16, mydata, make([]byte, 0))

	if err != nil {
		fmt.Println("Error ", err)
	}

	fmt.Println(getsm1)
	fmt.Println(getsm2)
}

func GetNewMessages(mydata *SessionData) string {
	reqid, err := generateUUID()
	if err != nil {
		fmt.Println("Error ", err)
	}

	var respstring = getRecMessagesStringJSON(reqid, mydata.Pr_tachyon_auth_token)
	respd, err := httpPostRecMessages(respstring, mydata.GoogleApi, ProcessNewMessages)

	if err != nil {
		fmt.Println("Error ", err)
	}

	return respd
}

func ProcessNewMessages(jsonStr string) (bool, error) {

	var data interface{}

	err := json.Unmarshal([]byte(jsonStr), &data)
	if err != nil {
		return true, err
	}

	firstLevel := data.([]interface{})
	secondLevel := firstLevel[0].([]interface{})

	if len(secondLevel) == 2 {

		myobj := secondLevel[1].([]interface{})

		if len(myobj) == 2 {
			myobj2 := myobj[1].([]interface{})

			myGuid := myobj2[0].(string)
			myProto := myobj2[11].(string)
			fmt.Println(myGuid)
			fmt.Println(myProto)
		}

	}

	return false, nil
}

func GetSendMessage(sessionid, sendmessageid string, midcode int32, mydata *SessionData, message []byte) (string, error) {
	sendproto, err := CreateSendMessageBuf(sessionid, midcode, sendmessageid, message)

	sendprotoBuff := base64.StdEncoding.EncodeToString(sendproto)

	fmt.Println(sendprotoBuff)

	resjson, err := getSendMessagesStringJSON(13, mydata.Bugle, "Bugle", sendmessageid, mydata.Pr_tachyon_auth_token, sendprotoBuff)
	if err != nil {

		fmt.Println("Error:", err)
		return "", err
	}

	httprespack, err := httpPostAckMessages("/$rpc/google.internal.communications.instantmessaging.v1.Messaging/SendMessage", resjson, mydata.GoogleApi)
	if err != nil {
		fmt.Println("Error:", err)
		return "", err
	}

	return httprespack, nil
}

func ProcessRefreshData(jsonString string) (string, string, time.Time, error) {
	var jsonObj []interface{}
	var emptyTime time.Time

	err := json.Unmarshal([]byte(jsonString), &jsonObj)
	if err != nil {
		return "", "", emptyTime, err
	}

	newtach := jsonObj[1].([]interface{})[0].(string)
	expiredate := jsonObj[1].([]interface{})[1].(string)

	expiredateAsInt, err := strconv.ParseInt(expiredate, 10, 64)
	if err != nil {
		fmt.Println("Error converting string to int64:", err)
	}

	expAsDate := GetDateFromExp(expiredateAsInt)
	newbug15 := jsonObj[8].([]interface{})[0].([]interface{})[0].([]interface{})[1].(string)

	return newbug15, newtach, expAsDate, nil
}

func CheckRefreshToken(mydata *SessionData) {
	currDate := time.Now()
	if mydata.Expire.Before(currDate) {
		RefreshToken(mydata)
	}
}

func RefreshToken(mydata *SessionData) {
	utimestamp := time.Now().UnixNano() / int64(time.Millisecond)
	utimestamp *= 1000

	refreqid, err := generateUUID()
	if err != nil {
		fmt.Println(err)
		return
	}

	rtoken, err := GetRefreshToken(mydata.CryptoPriKey, mydata.CryptoPubKey, refreqid, utimestamp)
	if err != nil {
		fmt.Println(err)
		return
	}

	refJson := GetRefreshTokenJSON(refreqid, mydata.Pr_tachyon_auth_token, 15, mydata.Bugle15, "Bugle", utimestamp, rtoken)

	jsonData, err := json.Marshal(refJson)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	jsonString := string(jsonData)

	httprespack, err := httpPostAckMessages("/$rpc/google.internal.communications.instantmessaging.v1.Registration/RegisterRefresh", jsonString, mydata.GoogleApi)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	newbug15, newtach, expAsDate, err := ProcessRefreshData(httprespack)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	mydata.Bugle15 = newbug15
	mydata.Pr_tachyon_auth_token = newtach
	mydata.Expire = expAsDate
}

func GetNewSessionData() (*SessionData, error) {

	sess, err := GetKeysAndReturnSessionData()
	if err != nil {
		return nil, err
	}

	barr, err := ArrayFromKey(sess.pubKeyExp)
	if err != nil {
		return nil, err
	}

	newbarr, err := keyConverter(barr)

	if err != nil {
		return nil, err
	}

	uid1, err := generateUUID()
	if err != nil {
		return nil, err
	}

	proto, err := ConvertToByteArray(uid1, newbarr)

	if err != nil {
		return nil, err
	}

	body, err := httpGetGoogle()
	if err != nil {
		return nil, err
	}

	googleApi := GetGoogleApiFromHtml(string(body))

	phorel, err := httpPostPhoneRelay(proto, googleApi)
	if err != nil {
		return nil, err
	}

	mypto := ConvertProtoToResponse(phorel)
	qrbase64 := ConvertToBase64String(mypto.P5.P5Bytes)
	qrreqdata := mypto.Keyenc
	sess.GoogleApi = googleApi
	sess.Qrreqdata = qrreqdata
	sess.Qrbase64 = qrbase64

	uinta := ConvertToUint8Array(sess.Qrreqdata)

	qrproto, err := ConvertQRToByteArray(uinta, sess.CryptoMsgEncKey, sess.CryptoMsgHmac)
	if err != nil {
		return nil, err
	}

	qrbase64 = ConvertToBase64String(qrproto)

	qrlink := "https://g.co/amr?c=" + qrbase64

	fmt.Println("uint8:", qrlink)

	sess.QrLink = qrlink

	return sess, nil
}

func WaitForUserScan(sess *SessionData) (*SessionData, error) {

	uid2, err := generateUUID()
	if err != nil {
		return nil, err
	}

	recJson := getRecMessagesStringJSON(uid2, sess.Qrbase64)

	fmt.Println("Waiting for QR Scanned")

	pr, err := httpPostRecMessages(recJson, sess.GoogleApi, proc)
	if err != nil {
		return nil, err
	}

	id, b64prot, err := ProcessString(pr)

	if err != nil {
		return nil, err
	}

	sess.UserScanId = id
	sess.UserScanProto = b64prot

	b64bytes, err := base64.StdEncoding.DecodeString(sess.UserScanProto)
	if err != nil {
		return nil, err
	}

	ress := ConvertProtoToUserScan(b64bytes)

	sess.Pr_tachyon_auth_token = ConvertToBase64String(ress.Data.Tachyon.Tachyon)
	sess.Bugle = ress.Data.Bugle13.BugleNum
	sess.Bugle15 = ress.Data.Bugle15.BugleNum
	sess.Expire = GetDateFromExp(86400000000)
	return sess, nil
}

func proc(test string) (bool, error) {
	id, _, err := ProcessString(test)

	if err != nil {
		return false, err
	}

	if id != "" {
		return true, nil
	}

	return false, nil
}
