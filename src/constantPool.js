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

#include "constantPool.jsh"
#include "cpu.jsh"

/** @constructor */
var constUtf8 = function(){
    this.str = null;
    this.id = CONSTANT_Utf8;
    this.read = function ( dStream ) {
        var strBuf;
        var charCnt;
        var byte_x,byte_y,byte_z;
        var result;
        var one_char = '\u0000';
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

/** @constructor */
var constInt = function(){
    this.value = null;
    this.id = CONSTANT_Integer;
    this.read = function ( dStream ){
        this.value = dStream.getInt32();
    }
};

/** @constructor */
var constFloat = function(){
    this.value = null;
    this.id = CONSTANT_Float;
    this.read = function ( dStream ){
        this.value = dStream.getFloat32();
    }
};

/** @constructor */
var constLong = function(){
    this.high = null;
    this.low = null;
    this.id = CONSTANT_Long;
    this.read = function (dStream){
        var high = dStream.getU4();
        var low = dStream.getU4();
        this.value = math.Long.fromBits(low,high)
    }
};

/** @constructor */
var constDouble = function(){
    this.high = null;
    this.low = null;
    this.id = CONSTANT_Double;
    this.read = function (dStream){
        // var high_bytes = dStream.getU4();
        // var low_bytes = dStream.getU4();
        // var bits = (high_bytes * Math.pow(2,32)) + low_bytes;
        // if (bits == 0x7ff0000000000000){
        //     this.value = POSITIVE_INF;
        // }else if (bits == 0xfff0000000000000){
        //     this.value = NEGATIVE_INF
        // }else if ((0x7ff0000000000001 < bits && bits < 0x7fffffffffffffff) || (0xfff0000000000001 < bits && bits < 0xffffffffffffffff)){
        //     this.value = NaN;
        // }else{
        //     var s = ((high_bytes >> 31) == 0) ? 1 : -1;
        //     var e = ((high_bytes >> 20) & 0x7ff);
        //     var m = 1
        //     /*
        //     (e == 0) ?
        //              (bits & 0xfffffffffffff) * 2 :
        //              (bits & 0xfffffffffffff) | 0x10000000000000;*/
        //     var string = (((high_bytes & 0xfffff) * Math.pow(2,32)) + low_bytes).toString(2);
        //     for (var i=0; i<string.length; i++){
        //         if (string[i] == "1"){
        //             m+=Math.pow(2,-(52-i))
        //         }
        //     }
        //     this.value = s * (1+m) * Math.pow(2, e - 1023);
        //}
        this.value = dStream.getFloat64();
    }
};

/** @constructor */
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
        this.jvmClassName = canonicalName(this.name_ref);
    }
};

/** @constructor */
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

/** @constructor */
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

/** @constructor */
var constFieldRef = function(){
    var temp = new constRef();
    temp.id = CONSTANT_Fieldref;
    return temp;
};

/** @constructor */
var constMethodRef = function(){
    var temp = new constRef();
    temp.id = CONSTANT_Methodref;
    return temp;
};

/** @constructor */
var constInterfaceMethodRef = function(){
    var temp = new constRef();
    temp.id = CONSTANT_InterfaceMethodref;
    return temp;
};

/** @constructor */
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
    return this.constantPool[(i-1)];
}