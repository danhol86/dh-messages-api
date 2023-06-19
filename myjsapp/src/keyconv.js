KeyConverter = function(a) {

    v = new Qya;
    x = new Qya;
    var y = new Qya;

    combineMyByteArrays(y, [1, 2, 840, 10045, 2, 1]);
    combineMyByteArrays(y, [1, 2, 840, 10045, 3, 1, 7]);
    AddInfo(x, y.slice.slice(0, y.length));
    AddValueAndLengthen(x, 3);
    AddValueAndLengthen(x, a.length + 1);
    AddValueAndLengthen(x, 0);
    for (y = 0; y < a.length; y++)
        AddValueAndLengthen(x, a[y]);
    AddInfo(v, x.slice.slice(0, x.length));
    l = v.slice.slice(0, v.length);

    return l;
}

var Qya = function () {
    this.slice = new Uint8Array(91);
    this.length = 0;
};

var AddInfo = function (a, c) {
    AddValueAndLengthen(a, 48);
    AddValueAndLengthen(a, c.length);
    for (var b = 0; b < c.length; b++)
        AddValueAndLengthen(a, c[b]);
};

function combineMyByteArrays(a, c) {
    AddValueAndLengthen(a, 6);
    var b = a.length;
    a.length++;
    AddValueAndLengthen(a, 40 * c[0] + c[1]);
    for (var d = 2; d < c.length; d++) {
        var e = c[d],
        f = [];
        if (128 < e) {
        f.push(Math.floor(e / 128) + 128);
        }
        f.push(e % 128);
        e = f;
        for (f = 0; f < e.length; f++) {
        AddValueAndLengthen(a, e[f]);
        }
    }
    a.slice[b] = a.length - b - 1;
}

function AddValueAndLengthen(a, c) {
    a.slice[a.length] = c;
    a.length++;
}

module.exports = {
    ConvertKey : KeyConverter
}