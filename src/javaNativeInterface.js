/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: javaNativeInterface.js
 * Time-stamp: Fri Jul 15 02:46:27 2011
 *
 * Author: Artur Ventura
 *
 */
 
//arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V
function java_lang_System_arraycopy(src,srcPos,dest,destPos,length){
    var temp = src.value.slice(srcPos,length);
    for (var i = 0; i < temp.length; i++){
        dest.value[destPos + i] = temp[i];
    }
}

//java.lang.Object registerNatives()V
function java_lang_Object_registerNatives(){
    
}

//java.lang.System registerNatives()V
function java_lang_System_registerNatives(){
    
}

//java.lang.System currentTimeMillis()J
function java_lang_System_currentTimeMillis(){
	return math.Long.fromInt(new Date().getTime());
}
//java.lang.Class getPrimitiveClass(Ljava/lang/String;)Ljava/lang/Class;
function java_lang_Class_getPrimitiveClass (type) {
	return this.jvm['primitive_' + javaString2JS(type)];
}