/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: constantPool.js
 * Time-stamp: Fri Jul 15 02:46:27 2011
 *
 * Author: Artur Ventura
 *
 */

#define CONSTANT_Utf8                1
//what is CONSTANT_?????             2
#define CONSTANT_Integer             3
#define CONSTANT_Float               4
#define CONSTANT_Long                5
#define CONSTANT_Double              6
#define CONSTANT_Class               7
#define CONSTANT_String              8
#define CONSTANT_Fieldref            9
#define CONSTANT_Methodref          10
#define CONSTANT_InterfaceMethodref 11
#define CONSTANT_NameAndType        12

// constant pool members

var constUtf8 = function(){
    this.str = null;
    this.id = CONSTANT_Utf8;
    this.read = function ( dStream ) {
        var strBuf;
        var charCnt;
        var byte_x,byte_y,byte_z;
        var result;
        one_char = '\u0000';
        this.length = dStream.getU2();
        strBuf = "";
        charCnt = 0;
        while (charCnt < this.length) {
            byte_x = dStream .getU1();
            charCnt++;
            if ((byte_x >> 7) == 1){
                byte_y = dStream .getU1();
                charCnt++;
                if ((byte_x >> 5) == 7){
                    byte_z = dStream .getU1();
                    charCnt++;
                    result = ((byte_x & 0xf) << 12) + ((byte_y & 0x3f) << 6) + (byte_z & 0x3f)
                }else{
                    result = ((byte_x & 0x1f) << 6) + (byte_y & 0x3f)
                }
            }else{
                result = byte_x
            }
            strBuf += String.fromCharCode(byte_x);
    } // while
        this.str = strBuf.toString();
  } // read
    return this;  
};

var constInt = function(){
    this.value = null;
    this.id = CONSTANT_Integer;
    this.read = function ( dStream ){
        this.value = dStream.getU4();
    }
};

var constFloat = function(){
    this.value = null;
    this.id = CONSTANT_Float;
    this.read = function ( dStream ){
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
        this.name_index = dStream.getU2();
    }
    this.set_ref = function(pool){
        var ref = pool[this.name_index - 1];
        if (!ref || ref.id != CONSTANT_Utf8){
            throw "Class name index doesn't point to Utf8 in the Constant Pool";
        }
        this.name_ref = ref;
    }
};

var constString = function(){
    this.string_index = null;
    this.id = CONSTANT_String;
    this.read = function(dStream){
        this.string_index = dStream.getU2();
    }
    this.set_ref = function(pool){
        var ref = pool[this.string_index - 1];
        if (!ref && ref.id != CONSTANT_Utf8){
            throw "String index doesn't point to Utf8 in the Constant Pool";
        }
        this.string_ref = ref;
    }
};

var constRef = function(){
    this.class_index = null;
    this.name_and_type_index = null;
    this.read = function(dStream){
        this.class_index = dStream.getU2();
        this.name_and_type_index = dStream.getU2();
    };
    this.set_ref = function(pool){
        var classRef = pool[this.class_index - 1];
        if (!classRef || classRef.id != CONSTANT_Class){
            throw constTagName(this.id) + " class index doesn't point to Class in the Constant Pool";
        }
        this.class_ref = classRef;

        var nAiRef = pool[this.name_and_type_index - 1];
        if (!nAiRef || nAiRef.id != CONSTANT_NameAndType){
            throw constTagName(this.id) + " name and type index doesn't point to Name and Type in the Constant Pool, got " + constTagName(nAiRef.id);
        }
        this.name_and_type_ref = nAiRef;
    }
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
    this.set_ref = function(pool){
        var nameRef = pool[this.name_index - 1];
        if (!nameRef || nameRef.id != CONSTANT_Utf8){
            throw "Name_and_Type name index doesn't point to Utf8 in the Constant Pool";
        }
        this.name_ref = nameRef;
        
        var descriptorRef = pool[this.descriptor_index - 1];
        if(!descriptorRef || descriptorRef.id != CONSTANT_Utf8){
            throw "Name_and_Type descriptior index doesn't point to Utf8 in the Constant Pool";
        }
        this.descriptor_ref = descriptorRef;
    }
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
        throw "allocConstEntry: bad tag value = " + tag;
      break;
    } // switch
    return obj;
}

var constTagName = function (info){
    switch(info){
        case 7:
        return "Class";
        
        case 9:
        return "FieldRef";
        
        case 10:
        return "MethodRef";
        
        case 11:
        return "InterfaceMethodRef"; 
        
        case 8:
        return "String";
        
        case 3:
        return "Integer";
        
        case 4:
        return "Float";
        
        case 5:
        return "Long";
        
        case 6:
        return "Double";
        
        case 12:
        return "NameAndType";
        
        case 1:
        return "Utf8";
   
        default:
        return "??0x" + info.toString(16) + "??";
    }
    return null;
}

var ConstantPoolRef = function(index, constantPool, expected){
    if (index-1 < 0 || index-1 >= constantPool.constantPool.length){
        throw "ConstantPoolRef: ref out of bounds: " + (index-1).toString() + ", length: " + constantPool.constantPool.length;
    }
    var result = constantPool.constantPool[index - 1];
    if (expected && result.id != expected){
        throw "ConstantPoolRef: ref was expected to be " + constTagName(expected) + " but at " + index + " there's a " + constTagName(result.id);
    }
    return result;
}

var ConstantPool = function(){
}

ConstantPool.prototype.loadFromStream = function(dStream){
    this.constantPoolCount = dStream.getU2();
    this.constantPool = [];
    for(var i = 1; i < this.constantPoolCount; i++){        
        var tag = dStream.getU1();
        var alloc = allocConstEntry(tag);
	alloc.read(dStream);
        this.constantPool[(i-1)] = alloc;
        if (alloc.id == CONSTANT_Long || alloc.id == CONSTANT_Double) {
	    i++;
	    this.constantPool[(i-1)] = null;
        }
    }
    for(var i = 1; i < this.constantPoolCount; i++){
        var obj = this.constantPool[(i-1)];
        if (obj && obj.set_ref){
            obj.set_ref(this.constantPool);
        }
    }
    this.each = function(fn,kind){
        for(var i = 1; i < this.constantPoolCount; i++){
            var obj = this.constantPool[(i-1)];
            if (obj){
                if (obj.id != kind) {continue;}
                fn(obj);
            }
        }
    }
}

ConstantPool.prototype.get = function (i){
    return this.constantPoll[i];
}