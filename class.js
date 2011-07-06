// access flags DEFINE
var ACC_PUBLIC    = 0x0001; // Declared public; may be accessed from outside its package.
var ACC_PRIVATE	  = 0x0002; // Declared private; usable only within the defining class.
var ACC_PROTECTED = 0x0004; // Declared protected; may be accessed within subclasses.
var ACC_STATIC	  = 0x0008; // Declared static.
var ACC_FINAL     = 0x0010; // Declared final; no subclasses allowed.
var ACC_SUPER     = 0x0020; // Treat superclass methods specially when invoked by the invokespecial instruction.
var ACC_VOLATILE  = 0x0040; // Declared volatile; cannot be cached.
var ACC_NATIVE	  = 0x0100; // Declared native; implemented in a language other than Java.
var ACC_INTERFACE = 0x0200; // Is an interface, not a class.
var ACC_ABSTRACT  = 0x0400; // Declared abstract; may not be instantiated.
var ACC_TRANSIENT = 0x0080; // Declared transient; not written or read by a persistent object manager.

function slurpFile (filename, fa) {
    var xmlHttpRequest, response, result ;
    // ie support if (typeof ActiveXObject == "function") return this.load_binary_ie9(filename, fa);
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('GET', "testRuntime/" + filename, false);
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
var log = function (msg){
    write(msg);
    if (console){
        console.log(msg);
    }
}

var ClassDefinition = function (file,jvm){
    var dataStream = new DataStream(slurpFile(file)[1]);
    this.magic = dataStream.getU4();
    if (this.magic != 0xCAFEBABE){
        throw "Invalid Class Magic (" + this.magic + ")" ;
    }
    this.minorVersion = dataStream.getU2();    
    this.majorVersion = dataStream.getU2();
    if (this.majorVersion > 50 || this.majorVersion < 45){
        throw "Unsuported java class file format version";
    }
    this.constantPool = new ConstantPool(dataStream);
    this.access_flags = dataStream.getU2();
    
    this.this_class = ConstantPoolRef(dataStream.getU2(), this.constantPool, CONSTANT_Class);
    var superClassRef = dataStream.getU2();
    if (superClassRef){
        this.super_class = ConstantPoolRef(superClassRef, this.constantPool, CONSTANT_Class);
    }else{
        this.super_class = null;
    }
    this.interface_count = dataStream.getU2();
    
    this.interfaces = [];
    for(var i=0; i<this.interface_count; i++){
        this.interfaces[i] = ConstantPoolRef(dataStream.getU2(), this.constantPool,CONSTANT_Class);
    }

    this.fields_count = dataStream.getU2();
    this.fields = []
    for(var i=0; i<this.fields_count; i++){
        
        this.fields[i] = new FieldInfo(dataStream,this.constantPool);
    }

    this.methods_count = dataStream.getU2();
    this.methods=[];
    for(var i=0; i<this.methods_count; i++){
        this.methods[i] = new MethodInfo(dataStream, this.constantPool);
    }

    // Post added info;
    this.jvm = jvm;
    this className = this.this_class.name_ref.str.replace(/\//g,".");
}

ClassDefinition.prototype.isInterface = function () {
    return ACC_INTERFACE & this.access_flags;
}

ClassDefinition.prototype.isArrayClass = function (){
    return false;
}

ClassDefinition.prototype.isAssignable = function (T) {
    // 2.6.7 Assignment Conversion
    if (this.isInterface()){
        if (T.isInterface()){
            return this.isInterfaceOrSuperInterface(T);
        }else{
            return T == this.jvm.java_lang_object;
        }
    }else if(this.isArrayClass()){
        if (T.isInterface()){
            return (T == this.jvm.java_lang_cloneable || T == this.jvm.java_io_serializable);
        }else if (T.isArrayClass()){
            
        }else{
            return T == this.jvm.java_lang_object;
        }
    }else{
        if (T.isInterface()){
            return this.isInterfaceOrSuperInterface(T);
        }else{
            return this.isClassOrSuperClass(T);
        }
    }
}

ClassDefinition.prototype.isClassOrSuperClass = function(C){
    if (this == C){
        return true;
    }else{
        if (this.jvm.java_lang_object == this){
            return false;
        }else{
            this.jvm.classForName(this.super_class.name_ref).isClassOrSuperClass(C);
        }
    }
}

ClassDefinition.prototype.isInterfaceOrSuperInterface = function(I){
    if (this == I){
        return true;
    }else{
        for(var i; i<this.interface_count; i++){
            if (this.interfaces[i].isInterfaceOrSuperInterface(I)){
                return true;
            }
        }
        return false;
    }
}

function LoadClassFile (x,jvm){
    return new ClassDefinition(x,jvm);
}


