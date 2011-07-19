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

/** @constructor */
var FieldInfo = function(dStream,constantPool){
    this.access_flags = dStream.getU2();
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
var MethodInfo = function(dStream, constantPool){
    this.access_flags = dStream.getU2();
    this.name_ref = ConstantPoolRef(dStream.getU2(), constantPool, CONSTANT_Utf8);
    this.descriptor_ref = ConstantPoolRef(dStream.getU2(), constantPool, CONSTANT_Utf8);
    this.attributes_count = dStream.getU2();
    this.attributes = [];
    for (var i=0; i<this.attributes_count; i++){
        this.attributes[i] = Attribute(dStream,constantPool);
    }
}