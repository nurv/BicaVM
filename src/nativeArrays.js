/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: nativeArray.js
 * Time-stamp: Fri Jul 15 02:46:27 2011
 *
 * Author: Artur Ventura
 *
 */
 
#include "cpu.jsh"

String.prototype.toArray = function(){
    var result =[];
    for(i =0; i < this.length; i++){
      result.push(this.charCodeAt(i));
    }
    return result;
}

function printNativeArray(){
    var result = "[";
    if(this.primitive){
        switch(this['class']){
            case T_BOOLEAN:
            result += "Z";
            break;
            case T_BYTE:
            result += "B";
            break;
            case T_CHAR:
            result += "C";
            break;
            case T_DOUBLE:
            result += "D";
            break;
            case T_FLOAT:
            result += "F";
            break
            case T_INT:
            result += "I";
            break
            case T_LONG:
            result += "J";
            break
            case T_SHORT:
            result += "B";
            break
        }
    }else{
        result+="L" + this['class'].className + ";";
    }
    return result + "#" + this.length;
}
 
function make1DNativeArray(count,primitive,type){
    var inst = {toString: printNativeArray,length:count, dimensions:1, value:[], primitive:primitive, 'class':type};
    return inst;
}
