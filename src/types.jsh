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

#ifndef _TYPES_JSH_
#define _TYPES_JSH_

// Local Variables Types
#define LOC_VAR_boolean       0x001;
#define LOC_VAR_byte          0x002;
#define LOC_VAR_char          0x004;
#define LOC_VAR_short         0x008;
#define LOC_VAR_int           0x010;
#define LOC_VAR_float         0x020;
#define LOC_VAR_reference     0x040;
#define LOC_VAR_returnAddress 0x080;
#define LOC_VAR_long          0x100;
#define LOC_VAR_double        0x200;

// Reference Types
#define REF_TYPE_class     0x1
#define REF_TYPE_interface 0x2
#define REF_TYPE_array     0x4

//primitive max Max values
#define CHAR_MAX_VALUE               0x0000
#define CHAR_MIN_VALUE               0xFFFF

#define BYTE_MAX_VALUE                  127
#define BYTE_MIN_VALUE                 -128
#define BYTE_USIZE                      128

#define SHORT_MAX_VALUE               32767
#define SHORT_MIN_VALUE              -32768
#define SHORT_USIZE                   32768

#define INT_MAX_VALUE            2147483647
#define INT_MIN_VALUE           -2147483648
#define INT_USIZE                2147483648

#define LONG_MAX_VALUE  9223372036854776000
#define LONG_MIN_VALUE -9223372036854776000
#define LONG_USIZE      9223372036854776000

#define FLOAT_MAX_VALUE (2-Math.pow(2,-23))*Math.pow(2,127)
#define FLOAT_MIN_VALUE (2-Math.pow(2,-149))

#define DOUBLE_MAX_VALUE (2-Math.pow(2,-52))*Math.pow(2,1023)
#define DOUBLE_MIN_VALUE Math.pow(2,-1074)

#define NULL null

#define CHAR_OVERFLOW(value) ((value % (2*CHAR_MIN_VALUE)) - (CHAR_MIN_VALUE))
#define BYTE_OVERFLOW(value) ((value % (2*BYTE_USIZE)) - (BYTE_USIZE))
#define SHORT_OVERFLOW(value) ((value % (2*SHORT_USIZE)) - (SHORT_USIZE))
#define INT_OVERFLOW(value) ((value % (2*INT_USIZE)) - (INT_USIZE))
#define LONG_OVERFLOW(value) ((value % (2*LONG_USIZE)) - (LONG_USIZE))
#define POSITIVE_INF Number.POSITIVE_INFINITY
#define NEGATIVE_INF Number.NEGATIVE_INFINITY

#define IS_OVERFLOW(value,mark) (value > mark)
#define IS_UNDERFLOW(value,mark) (value < mark)

#define ADD(value1,value2)  (value1)+(value2)
#define AND(value1,value2)  (value1)&(value2)
#define DIV(value1,value2)  (value1)/(value2)
#define MUL(value1,value2)  (value1)*(value2)
#define NEG(value1)        -(value1)
#define OR(value1,value2)   (value1)|(value2)
#define REM(value1,value2)  (value1)%(value2)
#define SHL(value1,value2)  (value1)<<(0x001f&(value2)) 
#define SHR(value1,value2)  (value1)>>(0x001f&(value2)) 
#define SUB(value1,value2)  ((value1)-(value2))
#define USHR(value1,value2) ((value1)>0?(value1)>>s:((value1)>>s) + (2<<~s))
#define XOR(value1,value2)  ((value1)^(value2))

/*function getRefClass(ref){
    if (ref.type == REF_TYPE_array){
        return getArrayClass(ref);
    }else{
        return ref.classRef;
    }
}*/

#endif //_TYPES_JSH_

