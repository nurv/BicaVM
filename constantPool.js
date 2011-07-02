var CONSTANT_Class = 7;
var CONSTANT_Fieldref = 9;
var CONSTANT_Methodref = 10;
var CONSTANT_InterfaceMethodref = 11;
var CONSTANT_String = 8;
var CONSTANT_Integer = 3;
var CONSTANT_Float = 4;
var CONSTANT_Long = 5;
var CONSTANT_Double = 6;
var CONSTANT_NameAndType = 12;
var CONSTANT_Utf8 = 1;

// constant pool members

var constUtf8 = function(){
    this.str = null;
    this.id = CONSTANT_Utf8;
    this.read = function ( dStream ) {
    var strBuf;
    var len, charCnt;
    var one_byte;
    var one_char;

    one_char = '\u0000';
    len = dStream.getU2();
    strBuf = "";
    charCnt = 0;
    while (charCnt < len) {
      one_byte = dStream .getU1();
      charCnt++;
      if ((one_byte >> 7) == 1) {
	var tmp;

	// its a multi-byte character
	tmp = (one_byte & 0x3f);  // Bits 5..0 (six bits)
	// read the next byte
	one_byte = dStream .getU1();
	charCnt++;
	tmp = (tmp | ((one_byte & 0x3f) << 6));
	if ((one_byte >> 6) == 0x2) {
	  // We have 12 bits so far, get bits 15..12
	  one_byte = dStream .getU1();
	  charCnt++;
	  one_byte = (one_byte & 0xf);
	  tmp = (tmp | (one_byte << 12));
	}
	one_char = tmp;
      }
      else {
	  one_char = one_byte;
      }
      strBuf += String.fromCharCode(one_char);
    } // while
        
        this.str = strBuf.toString();
  } // read
    return this;  
};


var constDummy = function(){
    this.read = function (stream){};
    return this;
}

var constInt = function(){
    this.value = null;
    this.id = CONSTANT_Integer;
    this.read = function ( dSStream ){
        this.value = dStream.getU4();
    }
};

var constFloat = function(){
    this.value = null;
    this.id = CONSTANT_Float;
    this.read = function ( dSStream ){
        this.value = dStream.getU4();
    }
};

var constLong = function(){
    this.high = null;
    this.low = null;
    this.id = CONSTANT_Long;
    this.read = function (dStream){
        this.high = dStream.getU4();
        this.low = dStream.getU4();
    }
};

var constDouble = function(){
    this.high = null;
    this.low = null;
    this.id = CONSTANT_Double;
    this.read = function (dStream){
        this.high = dStream.getU4();
        this.low = dStream.getU4();
    }
};

var constClass = function(){
    this.name_index = null;
    this.id = CONSTANT_Class;
    this.read = function(dStream){
        this.name_index = dstream.getU2();
    }
};

var constString = function(){
    this.string_index = null;
    this.id = CONSTANT_String;
    this.read = function(dStream){
        this.string_index = dstream.getU2();
    }
};

var constString = function(){
    this.string_index = null;
    this.id = CONSTANT_String;
    this.read = function(dStream){
        this.string_index = dstream.getU2();
    }
};

var constRef = function(){
    this.class_index = null;
    this.name_and_type_index = null;
    this.read = function(dStream){
        this.class_index = dStream.getU2();
        this.name_and_type_index = dStream.getU2();
    };
};

var constFieldRef = function(){
    var temp = new constRef();
    temp.id = CONSTANT_Fieldref;
    return temp;
};

var constMethodRef = function(){
    var temp = new constRef();
    temp.id = CONSTANT_Methodref;
    return temp;
};

var constInterfaceMethodRef = function(){
    var temp = new constRef();
    temp.id = CONSTANT_InterfaceMethodref;
    return temp;
};

var constName_and_Type_info = function(){
    this.name_index = null;
    this.descriptor_index = null;
    this.id = CONSTANT_NameAndType;
    this.read = function(dStream){
        this.name_index = dStream.getU2();
        this.descriptor_index = dStream.getU2();
    };
}


var allocConstEntry = function(tag){
    var obj = null;

    switch ( tag ) {
    case CONSTANT_Utf8:
      obj = new constUtf8();
      break;
    case CONSTANT_Integer:
      obj = new constInt();
      break;
    case CONSTANT_Float:
      obj = new constFloat();
      break;
    case CONSTANT_Long:
      obj = new constLong();
      break;
    case CONSTANT_Double:
      obj = new constDouble();
      break;
    case CONSTANT_Class:
      obj = new constClass();
      break;
    case CONSTANT_String:
      obj = new constString();
      break;
    case CONSTANT_Fieldref:
        obj = new constFieldRef();
        break;
    case CONSTANT_Methodref:
        obj = new constMethodRef();
        break;
    case CONSTANT_InterfaceMethodref:
      obj = new constInterfaceMethodRef();
      break; 
    case CONSTANT_NameAndType:
      obj = new constName_and_Type_info();
      break;
    default:
        obj = new constDummy();
        //throw "allocConstEntry: bad tag value = " + tag;
      break;
    } // switch
    return obj;
}