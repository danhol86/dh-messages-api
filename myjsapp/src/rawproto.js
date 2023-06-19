async function getRawProto() {
    try {
        const RawProto = await import('rawproto');
        return RawProto;
    } catch (error) {
        console.error("Failed to import rawproto:", error);
    }
}

async function GetProto(buffer) {
    let RawProto = await getRawProto();
    var pro = RawProto.getData(buffer);
    return pro;
}

module.exports = {
    GetProtoFromBuffer : GetProto
}