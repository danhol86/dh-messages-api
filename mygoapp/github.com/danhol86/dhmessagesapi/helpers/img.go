package helpers

import (
	"io/ioutil"
	"log"

	"github.com/skip2/go-qrcode"
)

func SaveQRCode(qrlink string, fileloc string) {
	imgURL, err := qrcode.Encode(qrlink, qrcode.Medium, 256)
	if err != nil {
		log.Fatal("QR code generation failed:", err)
	}

	err = ioutil.WriteFile(fileloc, imgURL, 0644)
	if err != nil {
		log.Fatal("Failed to write file:", err)
	}
}
