/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: cpu.jsh
 *
 * Author: Artur Ventura
 *
 */

#ifndef _CPU_JSH_
#define _CPU_JSH_

#include "log.jsh"

#define JVM_THROWS_NEW(exception) throw "VER: throws new exception"
#ifdef DEBUG_INTRP
#define LOG_INTRP(x) LOG(x)
#define DEFALIAS(opx) case opx: if(!temp) { temp = pc + ": opx op:[" + operand_stack + "] lvar:[" + local_variables + "]"; }

#else
#define LOG_INTRP(x) 
#define DEFALIAS(opx) case opx:
#endif

#define PANIC(msg) throw new JVMPanic(msg)

#define DEFOP(opx) case opx: LOG_INTRP(pc + ": opx op:[" + operand_stack + "] lvar:[" + local_variables + "]");
#define DEFNOP() LOG_INTRP(temp)
#define ENDDEF break;

#define OPPOP() operand_stack.pop()
#define OPPUSH(v) operand_stack.push(v)

#define OPPOPD() (operand_stack.pop() || operand_stack.pop())
#define OPPUSHD(v) (operand_stack.push(v) && operand_stack.push(null))

#define OPSTACK(v) operand_stack[v]
#define OPSTACK_LENGTH() operand_stack.length

#define LOCAL_VAR(v) local_variables[v]
#define OPCODE opcode
#define PC pc
#define STACK_MOVE(y,x) OPSTACK(OPSTACK_LENGTH()-y) = OPSTACK(OPSTACK_LENGTH()-x)
#define READ_NEXT() code[pc++]

#define CHECK_NULL(ref) if (ref == NULL){ JVM_THROWS_NEW(java.lang.NullPointerException); }
#define CHECK_ARRAY_INDEX(ind,ref) if (ind >= ref.length){ JVM_THROWS_NEW(java.lang.ArrayIndexOutOfBoundsException); }

#define TO_INT(value)   if (isNaN(value)){ OPPUSH(0); }else if(IS_OVERFLOW(value,INT_MAX_VALUE)){ OPPUSH(INT_MAX_VALUE); }else if(IS_UNDERFLOW(value,INT_MIN_VALUE)){ OPPUSH(INT_MIN_VALUE); }else{ OPPUSH(Math.round(value)); }
#define TO_FLOAT(value) if (isNaN(value)){ OPPUSHD(NaN); }else if(IS_OVERFLOW(value,FLOAT_MAX_VALUE)){ OPPUSHD(POSITIVE_INF); }else if (IS_UNDERFLOW(value,FLOAT_MIN_VALUE)){ OPPUSHD(NEGATIVE_INF); }else{ OPPUSHD(value);}
#define TO_LONG(value)  if (isNaN(value)){ OPPUSH(0); }else if(IS_OVERFLOW(value,LONG_MAX_VALUE)){ OPPUSH(LONG_MAX_VALUE); }else if(IS_UNDERFLOW(value,LONG_MIN_VALUE)){ OPPUSH(LONG_MIN_VALUE); }else{ OPPUSH(Math.round(value));}

function canonicalName(ref) {return ref.str.replace(/\//g,".");}

#define QWORD(byte1,byte2,byte3,byte4) ((byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4)

#endif //_CPU_JSH_
