include("linearDataStream.js");
include("constantPool.js");

function slurpFile (filename, fa) {
    var xmlHttpRequest, response, result ;
    // ie support if (typeof ActiveXObject == "function") return this.load_binary_ie9(filename, fa);
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('GET', filename, false);
    if ('mozResponseType' in xmlHttpRequest) {
        xmlHttpRequest.mozResponseType = 'arraybuffer';
    } else if ('responseType' in xmlHttpRequest) {
        xmlHttpRequest.responseType = 'arraybuffer';
    } else {
        xmlHttpRequest.overrideMimeType('text/plain; charset=x-user-defined');
    }
    xmlHttpRequest.send(null);
    if (xmlHttpRequest.status != 200 && xmlHttpRequest.status != 0) {
        throw "Error while loading " + filename;
    }
    bf = true;
    if ('mozResponse' in xmlHttpRequest) {
        response = xmlHttpRequest.mozResponse;
    } else if (xmlHttpRequest.mozResponseArrayBuffer) {
        response = xmlHttpRequest.mozResponseArrayBuffer;
    } else if ('responseType' in xmlHttpRequest) {
        response = xmlHttpRequest.response;
    } else {
        response = xmlHttpRequest.responseText;
        bf = false;
    }
    if (bf) {
        result = [response.byteLength, response];
    } else {
        throw "No typed arrays";
    }
    return result;
};
log = function (msg){
    if (console){
        console.log(msg);
    }
}

ConstantPoolStruct = function (tag,info){
    log("0x" + tag.toString(16))
    switch(tag){
        case 7:
        log("Class: "+ info.toString(16));
        break;
        case 9:
        log("FieldRef: "+ info.toString(16));
        break;
        case 10:
        log("MethodRef: "+ info.toString(16));
        break;
        case 11:
        log("InterfaceMethodRef: "+ info.toString(16));
        break;
        case 8:
        log("String: " + info.toString(16));
        break;
        case 3:
        log("Integer: " + info.toString(16));
        break;
        case 4:
        log("Float: " + info.toString(16));
        break;
        case 5:
        log("Long: " + info.toString(16));
        break;
        case 6:
        log("Long: " + info.toString(16));
        break;
        case 12:
        log("NameAndType: " + info.toString(16));
        break;
        case 1:
        log("Utf8: " + info.toString(16));
        break;
        default:
        throw "Unkown tag number 0x" + tag.toString(16);
    }
    this.tag = tag;
    this.info = info;
};

ClassDefinition = function (file){
    var dataStream = new DataStream(slurpFile(file)[1]);
    this.magic = dataStream.getU4();
    this.magic == 0xCAFEBABE || alert("Invalid Class Magic");
    this.minorVersion = dataStream.getU2();
    this.majorVersion = dataStream.getU2();
    this.constantPoolCount = dataStream.getU2();
    this.constantPool = [];
    for(var i = 1; i <= this.constantPoolCount; i++){
        var tag = dataStream.getU1();
	var alloc = allocConstEntry(tag);
	alloc.read(dataStream);
        var info = new DataView(x, 10  + (i-1) * (1 + 1) + 1,1).getUint8(0);
        this.constantPool[(i-1)] = new ConstantPoolStruct(tag,info);
    }
}

function main (args){
    var classDef = new ClassDefinition("Test.class");
}