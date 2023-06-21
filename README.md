# dh-messages-client

This client uses android API to mimic browser calls to connect to and manage messages from https://messages.google.com/web/conversations

## Status

Node

* [x] extract QR code image
* [x] refresh token
* [x] read incoming messages
* [x] read messages for contact
* [x] send message to existing contact
* [x] download images
* [ ] download attachments
* [ ] send images/attachments
* [ ] send message to new number

Go

* [x] extract QR code image
* [x] refresh token
* [ ] read incoming messages
* [ ] read messages for contact
* [ ] send message to existing contact
* [ ] download images
* [ ] download attachments
* [ ] send images/attachments
* [ ] send message to new number

## Testing

### Node (Docker)

> [Install Docker](https://www.docker.com/products/docker-desktop/)

```
cd dh-messages-api/myjsapp
docker compose up --build
```

### Node (Local)

> [Install node > v15](https://nodejs.dev/en/download/)

```
cd dh-messages-api/myjsapp
npm install
node src/test.js
```

### Go (Docker)

> [Install Docker](https://www.docker.com/products/docker-desktop/)

```
cd dh-messages-api/mygoapp
docker compose up --build
```

### Go (Local)

> [Install Go](https://go.dev/dl/)

```
cd dh-messages-api/mygoapp/github.com/danhol86/dhmessagesapi
go mod download
go test
```

## Testing

* The tests will generate a new image file in the source data folder called myqrcode.png
* Open and scan image using messages app
* All events should fire and show in debug
* All required data is stored to data folder. This includes sessiondata, which is needed for reconnecting using tokens and encryption keys