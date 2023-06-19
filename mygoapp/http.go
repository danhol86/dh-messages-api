package main

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
)

func httpGetGoogle() ([]byte, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://messages.google.com/web/authentication", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("sec-ch-ua", `"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"`)
	req.Header.Set("sec-ch-ua-mobile", "?0")
	req.Header.Set("User-Agent", "(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36")
	req.Header.Set("Upgrade-Insecure-Requests", "1")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

func httpPostAckMessages(path string, jsondata string, googleapi string) (string, error) {
	url := "https://instantmessaging-pa.googleapis.com" + path

	req, err := http.NewRequest("POST", url, bytes.NewBufferString(jsondata))
	if err != nil {
		return "", err
	}

	req.Header.Set("Accept", "*/*")
	req.Header.Set("Accept-Encoding", "gzip, deflate, br")
	req.Header.Set("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8")
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Pragma", "no-cache")
	req.Header.Set("Sec-Ch-Ua", "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"")
	req.Header.Set("Sec-Ch-Ua-Mobile", "?0")
	req.Header.Set("Sec-Fetch-Dest", "empty")
	req.Header.Set("Sec-Fetch-Mode", "cors")
	req.Header.Set("Sec-Fetch-Site", "cross-site")
	req.Header.Set("x-goog-api-key", googleapi)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36")
	req.Header.Set("x-user-agent", "grpc-web-javascript/0.1")
	req.Header.Set("Referer", "https://messages.google.com/")
	req.Header.Set("Origin", "https://messages.google.com")
	req.Header.Set("Content-Type", "application/json+protobuf")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	reader, err := gzip.NewReader(resp.Body)
	if err != nil {
		return "", err
	}
	defer reader.Close()

	body, err := ioutil.ReadAll(reader)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func httpPostPhoneRelay(data []byte, googleapi string) ([]byte, error) {
	req, err := http.NewRequest("POST", "https://instantmessaging-pa.googleapis.com/$rpc/google.internal.communications.instantmessaging.v1.Pairing/RegisterPhoneRelay", bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept", "*/*")
	req.Header.Set("Accept-Encoding", "gzip, deflate, br")
	req.Header.Set("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8")
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Pragma", "no-cache")
	req.Header.Set("Sec-Ch-Ua", `"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"`)
	req.Header.Set("Sec-Ch-Ua-Mobile", "?0")
	req.Header.Set("Sec-Fetch-Dest", "empty")
	req.Header.Set("Sec-Fetch-Mode", "cors")
	req.Header.Set("Sec-Fetch-Site", "cross-site")
	req.Header.Set("X-Goog-Api-Key", googleapi)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36")
	req.Header.Set("X-User-Agent", "grpc-web-javascript/0.1")
	req.Header.Set("Referer", "https://messages.google.com/")
	req.Header.Set("Origin", "https://messages.google.com")
	req.Header.Set("Content-Type", "application/x-protobuf")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	switch resp.Header.Get("Content-Encoding") {
	case "gzip":
		reader, err := gzip.NewReader(resp.Body)
		if err != nil {
			return nil, err
		}
		defer reader.Close()

		buf := new(bytes.Buffer)
		buf.ReadFrom(reader)

		return buf.Bytes(), nil
	default:
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}

		return body, nil
	}
}

func httpPostRecMessages(jsonData string, googleAPIKey string, callback func(string) (bool, error)) (string, error) {
	client := &http.Client{}

	req, err := http.NewRequest("POST", "https://instantmessaging-pa.googleapis.com/$rpc/google.internal.communications.instantmessaging.v1.Messaging/ReceiveMessages", bytes.NewBufferString(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Accept", "*/*")
	req.Header.Set("Accept-Encoding", "gzip, deflate, br")
	req.Header.Set("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8")
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Pragma", "no-cache")
	req.Header.Set("Sec-CH-UA", `"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"`)
	req.Header.Set("Sec-CH-UA-Mobile", "?0")
	req.Header.Set("Sec-Fetch-Dest", "empty")
	req.Header.Set("Sec-Fetch-Mode", "cors")
	req.Header.Set("Sec-Fetch-Site", "cross-site")
	req.Header.Set("X-Goog-API-Key", googleAPIKey)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36")
	req.Header.Set("X-User-Agent", "grpc-web-javascript/0.1")
	req.Header.Set("Referer", "https://messages.google.com/")
	req.Header.Set("Origin", "https://messages.google.com")
	req.Header.Set("Content-Type", "application/json+protobuf")

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	mycont := resp.Header.Get("Content-Encoding")
	fmt.Println("header:", mycont)

	gzipReader, err := gzip.NewReader(resp.Body)
	if err != nil {
		return "", err
	}

	defer gzipReader.Close()

	myList := []string{}

	buf := make([]byte, 1024)
	for {
		n, err := gzipReader.Read(buf)
		if err != nil && err != io.EOF {
			return "", err
		}
		if n == 0 {
			break
		}
		// Do something with the data
		// In this case, we're just printing it

		alld := string(buf[:n])
		myList = append(myList, alld)
		ald := strings.Join(myList, "")

		if strings.HasSuffix(ald, strings.Repeat("]", 2)) {

			myList = myList[:0]
			myList = append(myList, "[[[[]]")

			newmess := ald

			if strings.HasSuffix(ald, strings.Repeat("]", 3)) {
				newmess = newmess + "]"
			} else if strings.HasSuffix(ald, strings.Repeat("]", 2)) {
				newmess = newmess + "]]"
			}

			resp, err := callback(newmess)

			if err != nil && err != io.EOF {
				return "", err
			}

			if resp {
				return newmess, nil
			}
		}

	}
	return "", err
}
