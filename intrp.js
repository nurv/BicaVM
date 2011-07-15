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

DEFOP(AALOAD)
    var index = operand_stack.pop();
    var arrayref = operand_stack.pop();

    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    operand_stack.push(arrayref.value[index.value]);
ENDDEF

DEFOP(AASTORE)
    var value = operand_stack.pop();
    var index = operand_stack.pop();
    var arrayref = operand_stack.pop();
    
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
    operand_stack.push(null);
ENDDEF

DEFOP(ALOAD)
    var i = operand_stack.pop();
    operand_stack.push(local_variables[i])
ENDDEF
    
DEFOP(ALOAD_0)
DEFOP(ALOAD_1)
DEFOP(ALOAD_2)
DEFOP(ALOAD_3)
    operand_stack.push(local_variables[opcode - 0x2a]);
ENDDEF

DEFOP(ANEWARRAY) 
    var indexbyte1 = code.pop();
    var indexbyte2 = code.pop();
    var count = operand_stack.pop();
    if (count < 0){
        JVM_THROWS_NEW(java.lang.NegativeArraySizeException);
    }
    var clRef = frame.classRef.constantPool.get((indexbyte1 << 8) | indexbyte2);
    var instance = {length)count, value)[], classRef)this.jvm.classForName(clRef)};
    operand_stack.push(instance);
ENDDEF

DEFOP(ARETURN)
    var objectref = operand_stack.pop();
    return {return_object) objectref}
ENDDEF

DEFOP(ARRAYLENGTH)
    var arrayref = operand_stack.pop();
    operand_stack.push(arrayref.length);
ENDDEF

DEFOP(ASTORE)
    var objectref = operand_stack.pop();
    local_variables[code.pop()] = objectref;
ENDDEF
    
DEFOP(ASTORE_0)
DEFOP(ASTORE_1)
DEFOP(ASTORE_2)
DEFOP(ASTORE_3)
    var objectref = operand_stack.pop();
    local_variables[opcode-0x4b] = objectref;
ENDDEF


DEFOP(ATHROW)
    var objectref = operand_stack.pop();
    if (objectref == null){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    throw [objectref.classRef.name_ref.str,objectref];
ENDDEF

DEFOP(BALOAD)
    var value = operand_stack.pop();
    var index = operand_stack.pop();
    var arrayref = operand_stack.pop();
    
    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    arrayref.value[index] = value;
ENDDEF

DEFOP(BIPUSH)
    operand_stack.push(code.pop());
ENDDEF
    
DEFOP(CALOAD)
    var index = operand_stack.pop();
    var arrayref = operand_stack.pop();

    operand_stack.push(arrayref.value[index]);
ENDDEF

DEFOP(CASTORE)
    var value = operand_stack.pop();
    var index = operand_stack.pop();
    var arrayref = operand_stack.pop();

    
    if (arrayref == NULL){
        JVM_THROWS_NEW(java.lang.NullPointerException);
    }
    if (index >= arrayref.length){
        JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException);
    }
    arrayref.value[index] = value;
ENDDEF
    
DEFOP(CHECKCAST)
    var objectref = operand_stack.pop();
    var indexbyte1 = code.pop();
    var indexbyte2 = code.pop();
    var clRef = frame.classRef.constantPool.get((indexbyte1 << 8) | indexbyte2);
    if (objectref.classRef.isAssignable(clRef)){
        operand_stack.push(objectref);
    }else{
        JVM_THROWS_NEW(java.lang.ClassCastException);            
    }
ENDDEF
    
DEFOP(D2F)
    PANIC("Not Implemented Yet");
ENDDEF

DEFOP(D2F)
    PANIC("Not Implemented Yet");
ENDDEF

DEFOP(D2L)
    PANIC("Not Implemented Yet");
ENDDEF

DEFOP(DADD)
    PANIC("Not Implemented Yet");
ENDDEF

DEFOP(DALOAD)