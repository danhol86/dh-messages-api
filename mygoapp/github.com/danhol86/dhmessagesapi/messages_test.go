package test

import (
	"encoding/json"
	"fmt"
	"runtime"
	"testing"

	"github.com/danhol86/dhmessagesapi/helpers"
	"github.com/danhol86/dhmessagesapi/messages"
)

func TestAllFunction(t *testing.T) {
	rootFolder := "/data/"
	if runtime.GOOS == "windows" {
		rootFolder = "../../../data/"
	}

	sess := &messages.SessionData{}

	sessionFileLocation := rootFolder + "sessionFile.json"
	sessionDataString := helpers.ReadTextFromFile(sessionFileLocation, false)

	if sessionDataString != "" {

		fmt.Println("Existing session data found")

		err := json.Unmarshal([]byte(sessionDataString), &sess)

		if err != nil {
			t.Fatal(err)
		}

		fmt.Println("Checking refresh token")
		messages.CheckRefreshToken(sess)
	} else {

		newsess, err := messages.GetNewSessionData()

		if err != nil {
			t.Fatal(err)
		}

		helpers.SaveQRCode(newsess.QrLink, rootFolder+"goQR.png")

		newsess, err = messages.WaitForUserScan(newsess)

		if err != nil {
			t.Fatal(err)
		}
		sess = newsess
	}

	fmt.Println("Updating session file")
	helpers.WriteJSONToFile(sessionFileLocation, sess)

	messages.StartSession(sess)

	messages.GetNewMessages(sess)
}
