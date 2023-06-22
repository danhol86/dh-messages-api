package helpers

import (
	"bufio"
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"strconv"
)

func WriteJSONToFile(sessionFileName string, data interface{}) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Fatalf("Failed to JSON encode data: %v", err)
	}

	err = ioutil.WriteFile(sessionFileName, jsonData, 0644)
	if err != nil {
		log.Fatalf("Failed to write JSON data to file: %v", err)
	}
}

func ReadTextFromFile(filename string, unquote bool) string {
	// Read text from file
	file, err := os.Open(filename)
	if err != nil {
		return ""
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		var t = scanner.Text()

		if unquote {
			unquotedText, _ := strconv.Unquote(`"` + t + `"`)
			return unquotedText
		} else {
			return t
		}
	}
	if err := scanner.Err(); err != nil {
		return ""
	}

	return ""
}
