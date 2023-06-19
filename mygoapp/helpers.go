package main

import (
	"encoding/base64"
	"encoding/json"
	"regexp"
	"time"
)

func ConvertToBase64String(data []byte) string {

	str := base64.StdEncoding.EncodeToString(data)

	return str
}

func GetGoogleApiFromHtml(html string) string {
	reg := regexp.MustCompile(`(A16fYe\\x22,\\x5bnull,null,\\x22)(?P<GoogleApi>.*?)(\\x22\\x5d\\x5d)`)
	match := reg.FindStringSubmatch(html)
	if len(match) > 0 {
		for i, name := range reg.SubexpNames() {
			if name == "GoogleApi" {
				return match[i]
			}
		}
	}
	return ""
}

func GetDateFromExp(d int64) time.Time {
	expireDate := d / 60000000

	d1 := time.Now()
	d2 := d1.Add(time.Minute * time.Duration(expireDate-60))
	return d2
}

func ConvertToUint8Array(byteArray []byte) []uint8 {
	uint8Array := make([]uint8, len(byteArray))
	copy(uint8Array, byteArray)
	return uint8Array
}

func getResponseBuffer(httpresp []byte) []byte {
	buff := make([]byte, len(httpresp))
	copy(buff, httpresp)

	// Trim last 8 bytes
	buff = buff[:len(buff)-8]

	// Remove first 15 bytes
	buff = buff[15:]

	return buff
}

func ProcessString(jsonString string) (string, string, error) {
	var jsonObj [][][]interface{}
	var guid string
	var protod string

	err := json.Unmarshal([]byte(jsonString), &jsonObj)
	if err != nil {
		return "", "", err
	}

	for i := 0; i < len(jsonObj); i++ {
		for j := 0; j < len(jsonObj[i]); j++ {
			if len(jsonObj[i][j]) > 1 {
				var ob = jsonObj[i][j][1]
				if ob != nil {
					myVal := ob.([]interface{})

					protod = myVal[11].(string)
					guid = myVal[0].(string)
				}
			}
		}
	}

	return guid, protod, nil
}
