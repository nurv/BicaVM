/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: class.js
 * Time-stamp: Fri Jul 15 02:46:27 2011
 *
 * Author: Artur Ventura
 *
 */

#include "constantPool.jsh"
#include "class.jsh"

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
    var bf = true;
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
/** @constructor */
var ClassDefinition = function(jvm) {
        this.jvm = jvm;
};

// bad bad code! This shouldn't be done this way!
ClassDefinition.prototype.makeForArray = function(arrayDef){
    this.magic = CLASS_MAGIC;
    this.minorVersion = 0;
    this.majorVersion = 50;
    this.constantPool = [];
    this.access_flags = 0;
    this.this_class = {id:CONSTANT_Class, name_ref:{str:arrayDef}};
    this.super_class = null;
    this.interface_count = 0;
    this.interfaces = [];
    this.fields_count = 0; 
    this.fields = [];
    this.methods_count = 1;
    this.methods = [
        {
            access_flags:0,
            name_ref: {str:"clone"},
            descriptor_ref: {str: "()Ljava.lang.Object;"},
            attributes_count:0,
            attributes: []
        }
    ];
    ClassDefinition.prototype.isArrayClass = function (){
        return true;
    }

    // extra info:
    this.dimensions = 0;
    var i=0;
    for (i=0; i<arrayDef.length; i++){
        if (arrayDef.charAt(i) == "["){
            this.dimensions += 1;
        }else{
            break;
        }
    }
    this.arrayType = arrayDef.substr(1,arrayDef.length);
    if (this.arrayType.charAt(0) == "L"){
        this.arrayTypeClass = arrayDef.substr(i+1,arrayDef.length-1);
        this.jvm.classForName(this.arrayTypeDef);
    }else{
        this.arrayTypeClass = "";
    }
    
}

ClassDefinition.prototype.loadFromFile = function (file){
    var dataStream = new DataStream(slurpFile(file)[1]);
    this.magic = dataStream.getU4();
    if (this.magic != CLASS_MAGIC){
        throw "Invalid Class Magic (" + this.magic + ")" ;
    }
    this.minorVersion = dataStream.getU2();    
    this.majorVersion = dataStream.getU2();
    if (this.majorVersion > 50 || this.majorVersion < 45){
        throw "Unsuported java class file format version";
    }
    this.constantPool = new ConstantPool();
    this.constantPool.loadFromStream(dataStream);
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

    this.attributes_count = dataStream.getU2();
    this.attributes = [];
    for (var i=0; i<this.attributes_count; i++){
        this.attributes[i] = Attribute(dataStream,this.constantPool);
    }

    // Post added info;
    this.className = this.this_class.name_ref.str.replace(/\//g,".");
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
            if (T.arrayType.charAt(0) == this.arrayType.charAt(0) && (this.arrayType.charAt(0) == "L" || this.arrayType.charAt(0) == "[")){
                return this.jvm.classForName(this.arrayType).isAssignable(T.arrayType);
            }else{
                // VER: check if elements are primitive.
                if (T.arrayType.charAt(0) == this.arrayType.charAt(0)){
                    return true;
                }else{
                    return false;
                }
            }    
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
            this.super_class_ref.isClassOrSuperClass(C);
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

ClassDefinition.prototype.initializeClass = function(){
    if (this.super_class && !this.super_class_ref.inited){
        this.super_class_ref.initializeClass();
    }

    this.calculateEffectiveMembers();   
    for (var i=0; i<this.fields_count; i++){
        var f = this.fields[i];
        if(f.access_flags & ACC_STATIC){
            this[this.this_class.name_ref.str + " " + f.name_ref.str] = (f.primitive)?0:null;
        }
    }
    
    // call <cinit>
    this.inited = true;
}

ClassDefinition.prototype.calculateEffectiveMembers = function(){
    if (!this.effectiveMethods){
        var superEffective = (this.super_class)? this.super_class_ref.calculateEffectiveMembers() : [{},{}];

        // fields
        this.effectiveFields = {}        
        for(var k in superEffective[0]){
            this.effectiveFields[k] = superEffective[0][k];
        }
        
        for(var i=0; i<this.fields_count; i++){
            var field = this.fields[i]
            this.effectiveFields[this.this_class.name_ref.str + " " + field.name_ref.str] = field;
        }
        
        // methods
        this.effectiveMethods = {}
        for(var k in superEffective[1]){
            this.effectiveMethods[k] = superEffective[1][k];
        }
        
        for(var i=0; i<this.methods_count; i++){
            var method = this.methods[i]
            this.effectiveMethods[this.this_class.name_ref.str + " " + method.name_ref.str + method.descriptor_ref.str] = method;
        }

    }
    
    return [this.effectiveFields,this.effectiveMethods];       
}

ClassDefinition.prototype.makeInstance = function(){
    if (!this.inited) { this.initializeClass(); }
    var newInstance = {};
    for(var k in this.effectiveFields){
        if (!(this.effectiveFields[k].access_flags & ACC_STATIC)){
            newInstance[k] = (this.effectiveFields[k].primitive)?0:null;
        }
    }
    newInstance["class"] = this;
    return newInstance;
}

function LoadClassFile (x,jvm){
    var def = new ClassDefinition(jvm);
    if (x.charAt(0) != "[" ){
        def.loadFromFile(x);
    }else{
        def.makeForArray(x);
    }
    
    
    return def;
}


