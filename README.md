# dh-messages-client

This client uses android API and subtle encryption to mimic browser calls to connect to and manage messages from https://messages.google.com/web/conversations

## Status

- [x] extract QR code image
- [x] read incoming messages
- [x] read messages for contact
- [x] send message to existing contact
- [x] download images
- [ ] download attachments
- [ ] send images/attachments
- [ ] send message to new number
## Setup

Clone the repo and install the dependencies:

```
git clone https://github.com/danhol86/dh-messages-api
cd dh-messages-api
npm install
```
You will need to ensure you have have node v15 as uses Subtle from webcrypto.
## Testing

This repo contains test.ts file which uses all methods and events. 
* To run this simply call npm run start. 

* This will call Connect method which fires qr code event.

* This test will generate a new image file in the source folder called myqrcode.png

* Open and scan image using messages app

* All events should fire and show in debug

* All required data is stored to Data folder. This includes sessiondata, which is needed for reconnecting using tokens and encryption keys, and all message ids to track only new messages


## Events and functions

| Event         | Definition                                                                          |
| ------------- |-------------------------------------------------------------------------------------|
| error         | any error either thrown by http client of api                                       |
| qrcode        | on setting up new connection. called with qr code url                               |
| sessiondata   | anytime session tokens are updated on new setup or refreshing of token              |
| closed        | when http request is closed. google closes usually every 15 minutes                 |   
| invalidtoken  | if for any reason token isnt accepted by google                                     |
| messsagelist  | contains list of all messages including name/number and last message                |
| debug         | any debug message                                                                   |
| messageupdate | these are status messages such as 'sending....'                                     |
| convlist      | all messages for a particular conversation id                                       |

| Method        | Definition                                                                          |
| ------------- |-------------------------------------------------------------------------------------|
| Setup         | when reconnecting using existing session data (tokens/encryption from Connect stage)|
| Close         | closes http connection                                                              |
| Connect       | new connection, will trigger qrcode event on success                                |
| DownloadFile  | message will contain id of image/attachment to download                             |   