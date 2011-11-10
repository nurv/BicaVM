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