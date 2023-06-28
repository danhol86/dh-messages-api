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
* [x] read messages for contact
* [x] send message to existing contact
* [ ] download images
* [ ] download attachments
* [ ] send images/attachments
* [ ] send message to new number

## Testing

* The following tests will start the connection, and if needed, generate a new QR image file in the source data folder.
* Open and scan image using messages app
* All events should fire and show in console
* After auth, all required auth data is stored in a  sessiondata JSON file in data folder.
* If session file already exists, then initial QR not required, and will connect and refresh token where needed

### Node (Docker)

> [Install Docker](https://www.docker.com/products/docker-desktop/)

```
cd myjsapp
docker compose up --build
```

### Node (Local)

> [Install node > v15](https://nodejs.dev/en/download/)

```
cd myjsapp
npm install
node src/test.js
```

### Go (Docker)

> [Install Docker](https://www.docker.com/products/docker-desktop/)

```
cd mygoapp
docker compose up --build
```

### Go (Local)

> [Install Go](https://go.dev/dl/)

```
cd mygoapp
go run dhmessagestest
```
