package main

import (
	"log"

	"mygoapp/proto/dhmessagesapi/protos"

	"github.com/golang/protobuf/proto"
)

func ConvertProtoToUserScan(barr []byte) (resp protos.UserScan) {
	person := &protos.UserScan{}

	err := proto.Unmarshal(barr, person)
	if err != nil {
		log.Fatal("Unmarshal error:", err)
	}

	return *person
}

func ConvertProtoToResponse(barr []uint8) (resp protos.PRRecieve) {
	person := &protos.PRRecieve{}

	err := proto.Unmarshal(barr, person)
	if err != nil {
		log.Fatal("Unmarshal error:", err)
	}

	return *person
}

func ConvertToByteArray(uid string, barr []uint8) (data []byte, err error) {

	person := &protos.PRCreate{
		P1: &protos.PRCreate_PRCP1Scheme{
			Guid:  uid,
			Bugle: "Bugle",
			P1: &protos.PRCreate_PRCP1Scheme_PRCDateTime{
				Year:   2023,
				Month:  6,
				Day:    9,
				Hour:   14,
				Second: 30,
			},
		},
		P2: &protos.PRCreate_PRCP2Scheme{
			Browser: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
			Bnum:    2,
			Os:      "Windows",
			Version: "10.0",
		},
		P3: &protos.PRCreate_PRCP3Scheme{
			P1: &protos.PRCreate_PRCP3Scheme_PRCEncryptedP1Scheme{
				Bnum:   2,
				Keyenc: barr,
			},
		},
	}

	data1, err1 := proto.Marshal(person)
	if err1 != nil {
		log.Fatal("Marshaling error: ", err1)
	}

	data1 = ConvertToUint8Array(data1)

	return data1, err1
}

func ConvertQRToByteArray(barr1 []uint8, barr2 []byte, barr3 []byte) (data []byte, err error) {

	person := &protos.QR{
		P1: barr1,
		P2: barr2,
		P3: barr3,
	}

	data1, err1 := proto.Marshal(person)
	if err1 != nil {
		log.Fatal("Marshaling error: ", err1)
	}

	data1 = ConvertToUint8Array(data1)

	return data1, err1
}
