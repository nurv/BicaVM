/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: main.js
 * Time-stamp: Fri Jul 15 02:46:27 2011
 *
 * Author: Artur Ventura
 *
 */

#ifndef DEBUG
#define LOG(msg)
#else
#define LOG(msg) write(msg);\
    if (console){\
        console.log(msg);\
    }
#endif

#include "linearDataStream.js" 
#include "constantPool.js"
#include "attributes.js"
#include "infos.js"
#include "class.js"
#include "cpu.js"
#include "types.js"


var test_jvm;
function main (args){
    test_jvm = new JVM({},["foo"])
    test_jvm.run();
}