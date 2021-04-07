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
You will need to install node v15 as uses Subtle from webcrypto.
## Events and functions

Clone the repo and install the dependencies:
| Event         | Definition                                                                          |
| ------------- |-------------------------------------------------------------------------------------|
| error         |                                                                                     |
| qrcode        | on setting up new connection. called with qr code url                               |
| sessiondata   | anytime session tokens are updated on new setup or refreshing of token              |
| closed        | when http request is closed. google closes usually every 15 minutes                 |   
| invalidtoken  | if for any reason token isnt accepted by google                                     |
| messsagelist  | contains list of all messages including name/number and last message                |
| debug         | any debug message                                                                   |
| messageupdate | these are status messages such as 'sending....'                                     |
| convlist      | all messages for a particular conversation id                                       |