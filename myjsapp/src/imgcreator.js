const QRCode = require('qrcode')
const { writeFileSync } = require('fs');

var SaveQRCode = async function (qrlink, fileloc) { 
    var imgurl = await QRCode.toDataURL(qrlink);
    var base64Data = imgurl.replace(/^data:image\/png;base64,/, "");
    writeFileSync(fileloc, base64Data, 'base64');
}

module.exports = {
    SaveQRCode
}