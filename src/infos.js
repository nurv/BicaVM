/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: infos.js
 * Time-stamp: Fri Jul 15 02:46:27 2011
 *
 * Author: Artur Ventura
 *
 */

#include "constantPool.jsh"

#define DSCRPT_DEFAULT   0
#define DSCRPT_ARRAY     1
#define DSCRPT_OBJ       2

function parseArgs(descriptor){
    var sides = descriptor.substr(1,descriptor.length).split(")")
    var result = sides[1];
    var args = sides[0];
    var argsA = []
    var state = DSCRPT_DEFAULT;
    var temp = "";
    for (var i=0; i<args.length; i++){
        switch(args[i]){
            case "[":
            state = DSCRPT_ARRAY;
            temp += args[i];
            break;
            case "L":
            state = DSCRPT_OBJ;
            temp += args[i]
            break;
            case ";":
            if (state != DSCRPT_OBJ){
                PANIC("DESCRIPTOR ERROR");
            }
            temp += args[i]
            argsA.push(args[i]);
            temp ="";
            state = DSCRPT_DEFAULT;
            break;
            default:
            if (state == DSCRPT_ARRAY){
                temp += args[i];
                argsA.push(temp);
                temp  = "";
                state = DSCRPT_DEFAULT;
            }else{
                argsA.push(args[i]);
            }
        }
    }
    return {args:argsA,ret:result};
}

/** @constructor */
var FieldInfo = function(dStream,constantPool,cl){
    this.access_flags = dStream.getU2();
    this.dec_class = cl;
    this.name_ref = ConstantPoolRef(dStream.getU2(), constantPool, CONSTANT_Utf8);
    this.descriptor_ref = ConstantPoolRef(dStream.getU2(), constantPool, CONSTANT_Utf8);
    var type = this.descriptor_ref.str.charAt(0);
    this.primitive = (type == "L" || type == "[")?false:true;
    this.attributes_count = dStream.getU2();
    this.attributes = [];
    for (var i=0; i<this.attributes_count; i++){
        this.attributes[i] = Attribute(dStream,constantPool);
    }
}

/** @constructor */
var MethodInfo = function(dStream, constantPool,cl){
    this.access_flags = dStream.getU2();
    this.dec_class = cl;
    this.name_ref = ConstantPoolRef(dStream.getU2(), constantPool, CONSTANT_Utf8);
    this.descriptor_ref = ConstantPoolRef(dStream.getU2(), constantPool, CONSTANT_Utf8);
    this.descriptor = parseArgs(this.descriptor_ref.str);
    this.attributes_count = dStream.getU2();
    this.attributes = [];
    for (var i=0; i<this.attributes_count; i++){
        this.attributes[i] = Attribute(dStream,constantPool);
    }
    this.invoke = function (local_var,xl){
#ifdef DEBUG_INTRP
        LOG("Calling " + xl.className+ " " + this.name_ref.str + this.descriptor_ref.str)
#endif
        local_var = local_var||[];
        var frame = { operand_stack: [], local_variables:local_var };
        for (var i=0; i<this.attributes_count; i++){
            var attr = this.attributes[i];
            if (attr.id == ATTR_CODE){
                var result = interpret(frame,attr.code,this,xl);
#ifdef DEBUG_INTRP
        LOG("Returing from " + xl.className+ " " + this.name_ref.str + this.descriptor_ref.str)
#endif
                return result;
            }
        }
    }
}
