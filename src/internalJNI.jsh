/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: types.js
 * Time-stamp: Fri Jul 15 02:46:27 2011
 *
 * Author: Artur Ventura
 *
 */

 {
     'java.lang.System' : {
         'method arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V' : java_lang_System_arraycopy,
		 'method registerNatives()V' : java_lang_System_registerNatives,
         'method currentTimeMillis()J' : java_lang_System_currentTimeMillis
     },
     'java.lang.Object' : {
         'method registerNatives()V' : java_lang_Object_registerNatives
     },
	'java.lang.String' : {
		'method arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V' : java_lang_System_arraycopy
	},
	'java.lang.Class' : {
		'method registerNatives()V' : java_lang_Object_registerNatives,
		'method getPrimitiveClass(Ljava/lang/String;)Ljava/lang/Class;' : java_lang_Class_getPrimitiveClass
	},
	'java.lang.Float' : {
		'method floatToRawIntBits(F)I' : java_lang_Float_floatToRawIntBits
	},
	'java.lang.Double' : {
		'method doubleToRawLongBits(D)J' : java_lang_Double_doubleToRawLongBits
	}
 }