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

//java.lang.Float floatToRawIntBits(F)I
function java_lang_Float_floatToRawIntBits(f){
	var x = new ArrayBuffer(32);
	new Float32Array(x,0)[0] = f;
	return new Int32Array(x,0)[0];
}

//java.lang.Double doubleToRawLongBits(D)J
function java_lang_Double_doubleToRawLongBits(d){
	var x = new ArrayBuffer(32);
	new Float64Array(x,0)[0] = d;
	var y = new Int32Array(x,0);
	return new math.Long(y[0],y[1]);
}

function bicavm_browser_Window_setTitle(s){
	window.document.title = javaString2JS(s);
}
