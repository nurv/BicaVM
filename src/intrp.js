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
#define CHECK_NULL(ref) if (ref == NULL){ JVM_THROWS_NEW(java.lang.NullPointerException); }
#define CHECK_ARRAY_INDEX(ind,ref) if (ind >= ref.length){ JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException); }

#define TO_INT(value)   if (isNaN(value)){ OPPUSH(0); }else if(IS_OVERFLOW(value,INT_MAX_VALUE)){ OPPUSH(INT_MAX_VALUE); }else if(IS_UNDERFLOW(value,INT_MIN_VALUE)){ OPPUSH(INT_MIN_VALUE); }else{ OPPUSH(Math.round(value)); }
#define TO_FLOAT(value) if (isNaN(value)){ OPPUSHD(NaN); }else if(IS_OVERFLOW(value,FLOAT_MAX_VALUE)){ OPPUSHD(POSITIVE_INF); }else if (IS_UNDEFLOW(value,FLOAT_MIN_VALUE)){ OPPUSHD(NEGATIVE_INF); }else{ OPPUSHD(value);}
#define TO_LONG(value)  if (isNaN(value)){ OPPUSH(0); }else if(IS_OVERFLOW(value,LONG_MAX_VALUE)){ OPPUSH(LONG_MAX_VALUE); }else if(IS_UNDERFLOW(value,LONG_MIN_VALUE)){ OPPUSH(LONG_MIN_VALUE); }else{ OPPUSH(Math.round(value));}

DEFOP(AALOAD)
/*
 * ..., array ref, index -> ..., ref value
 */
    var index = OPPOP();
    var arrayref = OPPOP();
    
    CHECK_NULL(arrayref);
    CHECK_ARRAY_INDEX(index,arrayref);
    
    OPPUSH(arrayref.value[index]);
ENDDEF

DEFOP(AASTORE)
    var value = OPPOP();
    var index = OPPOP();
    var arrayref = OPPOP();
    
    CHECK_NULL(arrayref);
    CHECK_ARRAY_INDEX(index,arrayref);
    
    if (!arrayref.classRef.isAssignable(value.cl)){
        JVM_THROWS_NEW(java.lang.ArrayStoreException);
    }
    
    arrayref.value[index] = value;
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
    CHECK_NULL(objectref);
    throw [objectref.classRef.name_ref.str,objectref];
ENDDEF

DEFOP(BALOAD)
    var value = OPPOP();
    var index = OPPOP();
    var arrayref = OPPOP();
    
    CHECK_NULL(arrayref);
    CHECK_ARRAY_INDEX(index,arrayref);
    
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
    
    CHECK_NULL(arrayref);
    CHECK_ARRAY_INDEX(index,arrayref);
    
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
    var value = OPPOPD();
    TO_FLOAT(value)
ENDDEF

DEFOP(D2I)
    var value = OPPOPD();
    TO_INT(value);
ENDDEF

DEFOP(D2L)
    var value = OPPOPD();
    TO_LONG(value);
ENDDEF

DEFOP(DADD)
    var value1 = OPPOPD();
    var value2 = OPPOPD();
    var result = value1 + value2;
    if (IS_OVERFLOW(result,DOUBLE_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,DOUBLE_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
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
    OPPUSHD(arrayref.value[index]);
ENDDEF

DEFOP(DASTORE)
    var value = OPPOPD();
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
    var value2 = OPPOPD();
    var value1 = OPPOPD();
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
    OPPUSHD(OPCODE-DCONST_0);
ENDDEF

DEFOP(DDIV)
    var value2 = OPPOPD();
    var value1 = OPPOPD();
    var result = value1/value2;
    
    if (IS_OVERFLOW(result,DOUBLE_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,DOUBLE_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
    }
ENDDEF

DEFOP(DLOAD)
    var index = READ_NEXT();
    OPPUSHD(LOCAL_VAR(index));
ENDDEF

DEFALIAS(DLOAD_0)
DEFALIAS(DLOAD_1)
DEFALIAS(DLOAD_2)
DEFALIAS(DLOAD_3)
DEFNOP()
    var index = OPCODE - DLOAD_0;
    OPPUSHD(LOCAL_VAR(index));
ENDDEF

DEFOP(DMUL)
    var value2 = OPPOPD();
    var value1 = OPPOPD();
    var result = value1*value2;
    
    if (IS_OVERFLOW(result,DOUBLE_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,DOUBLE_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
    }
ENDDEF

DEFOP(DNEG)
    OPPUSHD(NEG(OPPOPD()));
ENDDEF

DEFOP(DREM)
    var value2 = OPPOPD()
    var value1 = OPPOPD()
    var result = value2 % value1
    
    if (IS_OVERFLOW(result,DOUBLE_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,DOUBLE_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
    }
ENDDEF

DEFOP(DRETURN)
    var objectref = OPPOPD()
    return {return_object: objectref}
ENDDEF

DEFOP(DSTORE)
    var index = READ_NEXT();
    var value = OPPOPD();
    LOCAL_VAR(index) = value;
ENDDEF

DEFALIAS(DSTORE_0)
DEFALIAS(DSTORE_1)
DEFALIAS(DSTORE_2)
DEFALIAS(DSTORE_3)
DEFNOP()
    var index = OPCODE - DLOAD_0;
    var value = OPPOPD();
    LOCAL_VAR(index) = value;
ENDDEF

DEFOP(DSUB)
    var value2 = OPPOPD()
    var value1 = OPPOPD()
    var result = value2 % value1

    if (IS_OVERFLOW(result,DOUBLE_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,DOUBLE_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
    }
ENDDEF

DEFOP(DUP)
    STACK_MOVE(0,1)
ENDDEF

DEFOP(DUP_X1)
    STACK_MOVE(0,1)
    STACK_MOVE(1,2)
    STACK_MOVE(2,0)
ENDDEF

DEFOP(DUP_X2)
    STACK_MOVE(0,1)
    STACK_MOVE(1,2)
    STACK_MOVE(2,3)
    STACK_MOVE(3,0)
ENDDEF

DEFOP(DUP2)
    STACK_MOVE(0,2)
    STACK_MOVE(1,3)
ENDDEF

DEFOP(DUP2_X1)
    STACK_MOVE(0,2)
    STACK_MOVE(1,3)
    STACK_MOVE(2,4)
    STACK_MOVE(3,0)
    STACK_MOVE(4,1)
ENDDEF

DEFOP(DUP2)
    STACK_MOVE(0, 2);
    STACK_MOVE(1, 3);
    STACK_MOVE(2, 4);
    STACK_MOVE(3, 5);
    STACK_MOVE(4, 0);
    STACK_MOVE(5, 1);
ENDDEF

DEFOP(F2D)
    // No Op, can box in the same space.
ENDDEF

DEFOP(F2I)
    var value = OPPOPD();
    TO_INT(value);
ENDDEF

DEFOP(F2L)
    var value = OPPOPD();
    TO_LONG(value);
ENDDEF

DEFOP(FADD)
    var value1 = OPPOPD();
    var value2 = OPPOPD();
    var result = value1 + value2;
    if (IS_OVERFLOW(result,FLOAT_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,FLOAT_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
    }
ENDDEF

DEFOP(FALOAD)
    var index = OPPOP();
    var arrayref = OPPOP();
    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    OPPUSHD(arrayref.value[index]);
ENDDEF

DEFOP(FASTORE)
    var value = OPPOPD();
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

DEFALIAS(FCMPG)
DEFALIAS(FCMPL)
DEFNOP()
    var value2 = OPPOPD();
    var value1 = OPPOPD();
    if (isNaN(value1) || isNaN(value2)) { OPPUSH((OPCODE == FCMPG)?1:0)}
    if (value1 > value2){
        OPPUSH(1);
    }else if(value1 == value2){
        OPPUSH(0);
    }else{
        OPPUSH(-1);
    }
ENDDEF

DEFALIAS(FCONST_1)
DEFALIAS(FCONST_0)
DEFNOP()
    OPPUSHD(OPCODE-FCONST_0);
ENDDEF

DEFOP(FDIV)
    var value2 = OPPOPD();
    var value1 = OPPOPD();
    var result = value1*value2;
    
    if (IS_OVERFLOW(result,FLOAT_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,FLOAT_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
    }
ENDDEF

DEFOP(FLOAD)
    var index = READ_NEXT();
    OPPUSHD(LOCAL_VAR(index));
ENDDEF

DEFALIAS(FLOAD_0)
DEFALIAS(FLOAD_1)
DEFALIAS(FLOAD_2)
DEFALIAS(FLOAD_3)
DEFNOP()
    var index = OPCODE - FLOAD_0;
    OPPUSHD(LOCAL_VAR(index));
ENDDEF

DEFOP(FMUL)
    var value2 = OPPOPD();
    var value1 = OPPOPD();
    var result = value1*value2;
    
    if (IS_OVERFLOW(result,FLOAT_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,FLOAT_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
    }
ENDDEF

DEFOP(FNEG)
    OPPUSHD(NEG(OPPOPD()));
ENDDEF

DEFOP(FREM)
    var value2 = OPPOPD()
    var value1 = OPPOPD()
    var result = value2 % value1
    
    if (IS_OVERFLOW(result,FLOAT_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,FLOAT_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
    }
ENDDEF

DEFOP(FRETURN)
    var objectref = OPPOPD()
    return {return_object: objectref}
ENDDEF

DEFOP(FSTORE)
    var index = READ_NEXT();
    var value = OPPOPD();
    LOCAL_VAR(index) = value;
ENDDEF

DEFALIAS(FSTORE_0)
DEFALIAS(FSTORE_1)
DEFALIAS(FSTORE_2)
DEFALIAS(FSTORE_3)
DEFNOP()
    var index = OPCODE - DLOAD_0;
    var value = OPPOPD();
    LOCAL_VAR(index) = value;
ENDDEF

DEFOP(FSUB)
    var value2 = OPPOPD()
    var value1 = OPPOPD()
    var result = value2 % value1

    if (IS_OVERFLOW(result,FLOAT_MAX_VALUE)){
        OPPUSHD(POSITIVE_INF);
    }else if(IS_UNDERFLOW(result,FLOAT_MIN_VALUE)){
        OPPUSHD(NEGATIVE_INF);        
    }else{
        OPPUSHD(result);
    }
ENDDEF

DEFOP(GETFIELD)
    var indexbyte1 = READ_NEXT();
    var indexbyte2 = READ_NEXT();
    var objectref = OPPOP();
    
    CHECK_NULL(objectref)
    field = objectref["class"].constantPool[(indexbyte1 << 8) | indexbyte2];
    //check if static
    OPPUSH(objectref[canonicalName(field.class_ref.name_ref.str) + " " + field.name_and_type_ref.name_ref.str]);
ENDDEF

DEFOP(GETSTATIC)
    
ENDDEF
