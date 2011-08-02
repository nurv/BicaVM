/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: cpu.js
 * Time-stamp: Fri Jul 15 02:46:27 2011
 *
 * Author: Artur Ventura
 *
 */

#include "constantPool.jsh"
#include "opcodes.jsh"
#include "types.jsh"
#include "cpu.jsh" 

/** @constructor */
var JVM = function(params,args){
    this.nativeMappingTable = {}
    this.params = params;
    this.args = args; 
    this.method_area = {};
    this.level = 0;
    this.classpath = params.classes_to_load;

    this.classForName = function (name){
        if (!name) { PANIC("undefined className")}
        var superClass, loaded_class = this.method_area[name];
        
        if (!loaded_class){
            loaded_class = LoadClassFile(name, this);
            this.method_area[name] = loaded_class;
            this.verifyAndLoadClass(loaded_class);
            
            LOG("[Loaded " + name  + "]");
        }
        
        return loaded_class;
        
    }
    
    this.verifyAndLoadClass = function(loaded_class){
        var superClass;
        if(loaded_class.super_class){
            // if super_class not java.lang.Object
                superClass = canonicalName(loaded_class.super_class.name_ref);
                loaded_class.super_class_ref = this.classForName(superClass);
        }

            // this doesn't seem right. doing this will cause the entire JRE to be loaded
            // as soon as you start JVM.
            
            /*
            var that = this;

            loaded_class.constantPool.each(function(constant){
                if (constant.name_ref.str.charAt(0) == "[") {
                    return;
                }
                that.verifyAndLoadClass(canonicalName(constant.name_ref));    
            }, CONSTANT_Class);*/
    };
    
    this.run = function (){
        this.java_lang_object = this.classForName("java.lang.Object");
        this.java_lang_cloneable = this.classForName("java.lang.Cloneable");
        this.java_io_serializable = this.classForName("java.io.Serializable");
        this.java_lang_string = this.classForName("java.lang.String");
        this.main_class = this.classForName(this.args[0])
        this.main_class.initializeClass();
        var method = this.main_class["method main([Ljava/lang/String;)V"];
        if (method == null){
            PANIC(this.args[0] + " doesn't have a a main method");
        }
        method.invoke(null,this.main_class);
    };
};
/** @constructor */
var JVMThread = function(){
    this.pc = null;
    this.stack = [];
}
/** @constructor */
var JVMFrame = function(){
    this.local_variables = [];
    this.operand_stack = [];
    
}
/** @constructor */
function JVMPanic(message){
    this.toString = function(){
        return "JVMPanic: " + message
    }
}

function interpret(frame,code,method,xl){
    var operand_stack = frame.operand_stack;
    var local_variables = frame.local_variables;
    var opcode;
    var pc = 0;

#ifdef DEBUG_INTRP
        var temp = null; 
#endif
    while(pc < code.length){
    opcode = READ_NEXT();
    switch(OPCODE){
#include "intrp.def"
    default:
        PANIC("Invalid OPCODE " + opcode);
    }
#ifdef DEBUG_INTRP
    temp = null;
#endif
    }
    PANIC("PC overran CODE");
}


