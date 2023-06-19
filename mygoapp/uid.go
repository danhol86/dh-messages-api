package main

import (
	"crypto/rand"
	"fmt"
	"strings"
)

var simdui string

func generateSegment() string {
	b := make([]byte, 2)
	_, err := rand.Read(b)
	if err != nil {
		fmt.Println(err)
		return ""
	}
	return fmt.Sprintf("%04x", uint16(b[0])<<8|uint16(b[1]))
}

func generateUUID() (string, error) {

	generateFullID := func() string {
		return generateSegment() + generateSegment() + "-" + generateSegment() + "-" + generateSegment() + "-" + generateSegment() + "-" + generateSegment() + generateSegment() + generateSegment()
	}

	splitID := func(id string) ([]string, string) {
		parts := strings.Split(id, "-")
		last := parts[len(parts)-1]
		parts[len(parts)-1] = last[:4] + parts[0]
		return parts, last[4:]
	}

	fullID := generateFullID()
	parts, lastSegment := splitID(fullID)
	joinedID := strings.Join(parts, "-")

	if simdui == "" {
		simdui = lastSegment
	}

	joinedID = joinedID[:len(joinedID)-8] + simdui

	return joinedID, nil
}
