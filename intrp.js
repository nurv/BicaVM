/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: intrp.js
 * Time-stamp: Fri Jul 15 02:46:27 2011
 *
 * Author: Artur Ventura
 *
 */

#include "opcodes.js"

DEFOP(AALOAD)
    var index = OPPOP();
    var arrayref = OPPOP();

    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    OPPUSH(arrayref.value[index.value]);
ENDDEF

DEFOP(AASTORE)
    var value = OPPOP();
    var index = OPPOP();
    var arrayref = OPPOP();
    
    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    if (!arrayref.classRef.isAssignable(value.cl)){
        JVM_THROWS_NEW(java.lang.ArrayStoreException);
    }
ENDDEF
    
DEFOP(ACONST_NULL)
    OPPUSH(null);
ENDDEF

DEFOP(ALOAD)
    var i = OPPOP();
    OPPUSH(LOCAL_VAR(i))
ENDDEF
    
DEFALIAS(ALOAD_0)
DEFALIAS(ALOAD_1)
DEFALIAS(ALOAD_2)
DEFALIAS(ALOAD_3)
DEFNOP()
    OPPUSH(LOCAL_VAR(OPCODE - ALOAD_0));
ENDDEF

DEFOP(ANEWARRAY) 
    var indexbyte1 = READ_NEXT();
    var indexbyte2 = READ_NEXT();
    var count = OPPOP();
    if (count < 0){
        JVM_THROWS_NEW(java.lang.NegativeArraySizeException);
    }
    var clRef = frame.classRef.constantPool.get((indexbyte1 << 8) | indexbyte2);
    var instance = {length:count, value:[], 'class':this.jvm.classForName(clRef)};
    OPPUSH(instance);
ENDDEF

DEFOP(ARETURN)
    var objectref = OPPOP();
    return {return_object: objectref}
ENDDEF

DEFOP(ARRAYLENGTH)
    var arrayref = OPPOP();
    OPPUSH(arrayref.length);
ENDDEF

DEFOP(ASTORE)
    var objectref = OPPOP();
    LOCAL_VAR(READ_NEXT()) = objectref;
ENDDEF
    
DEFALIAS(ASTORE_0)
DEFALIAS(ASTORE_1)
DEFALIAS(ASTORE_2)
DEFALIAS(ASTORE_3)
DEFNOP()
    var objectref = OPPOP();
    LOCAL_VAR(OPCODE-ASTORE_0) = objectref;
ENDDEF


DEFOP(ATHROW)
    var objectref = OPPOP();
    if (objectref == null){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    throw [objectref.classRef.name_ref.str,objectref];
ENDDEF

DEFOP(BALOAD)
    var value = OPPOP();
    var index = OPPOP();
    var arrayref = OPPOP();
    
    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    arrayref.value[index] = value;
ENDDEF

DEFOP(BIPUSH)
    OPPUSH(code.pop());
ENDDEF
    
DEFOP(CALOAD)
    var index = OPPOP();
    var arrayref = OPPOP();

    OPPUSH(arrayref.value[index]);
ENDDEF

DEFOP(CASTORE)
    var value = OPPOP();
    var index = OPPOP();
    var arrayref = OPPOP();
    
    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    arrayref.value[index] = value;
ENDDEF
    
DEFOP(CHECKCAST)
    var objectref = OPPOP();
    var indexbyte1 = READ_NEXT();
    var indexbyte2 = READ_NEXT();
    var clRef = frame.classRef.constantPool.get((indexbyte1 << 8) | indexbyte2);
    if (objectref.classRef.isAssignable(clRef)){
        OPPUSH(objectref);
    }else{
        JVM_THROWS_NEW(java.lang.ClassCastException);            
    }
ENDDEF
    
DEFOP(D2F)
    var value = OPPOP();
    if (isNaN(value)){
        OPPUSH(NaN);
    }else if(IS_OVERFLOW(value,FLOAT_MAX_VALUE)){
        OPPUSH(POSITIVE_INF);
    }else if (IS_UNDEFLOW(value,FLOAT_MIN_VALUE)){
        OPPUSH(NEGATIVE_INF);
    }else{
        OPPUSH(value);
    }
ENDDEF

DEFOP(D2I)
    var value = OPPOP();
    if (isNaN(value)){
        OPPUSH(0);
    }else if(IS_OVERFLOW(value,INT_MAX_VALUE)){
        OPPUSH(INT_MAX_VALUE);
    }else if(IS_UNDERFLOW(value,INT_MIN_VALUE)){
        OPPUSH(INT_MIN_VALUE);
    }else{
        OPPUSH(Math.round(value));
    }
ENDDEF

DEFOP(D2L)
    var value = OPPOP();
    if (isNaN(value)){
        OPPUSH(0);
    }else if(IS_OVERFLOW(value,LONG_MAX_VALUE)){
        OPPUSH(LONG_MAX_VALUE);
    }else if(IS_UNDERFLOW(value,LONG_MIN_VALUE)){
        OPPUSH(LONG_MIN_VALUE);
    }else{
        OPPUSH(Math.round(value));
    }
ENDDEF

DEFOP(DADD)
    var value1 = OPPOP();
    var value2 = OPPOP();
    var result = value1 + value2;
    if (IS_OVERFLOW(result,DOUBLE_MAX_VALUE)){
        OPPUSH(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,DOUBLE_MIN_VALUE)){
        OPPUSH(NEGATIVE_INF);        
    }else{
        OPPUSH(result);
    }
ENDDEF

DEFOP(DALOAD)
    var index = OPPOP();
    var arrayref = OPPOP();
    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    OPPUSH(arrayref.value[index]);
ENDDEF

DEFOP(DASTORE)
    var value = OPPOP();
    var index = OPPOP();
    var arrayref = OPPOP();
    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    arrayref.value[index] = value;
ENDDEF

DEFALIAS(DCMPG)
DEFALIAS(DCMPL)
DEFNOP()
    var value2 = OPPOP();
    var value1 = OPPOP();
    if (isNaN(value1) || isNaN(value2)) { OPPUSH((OPCODE == DCMPG)?1:0)}
    if (value1 > value2){
        OPPUSH(1);
    }else if(value1 == value2){
        OPPUSH(0);
    }else{
        OPPUSH(-1);
    }
ENDDEF

DEFALIAS(DCONST_1)
DEFALIAS(DCONST_0)
DEFNOP()
    OPPUSH(OPCODE-DCONST_0);
ENDDEF

