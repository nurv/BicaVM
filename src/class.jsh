/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: class.jsh
 *
 * Author: Artur Ventura
 *
 */



#define CLASS_MAGIC 0xCAFEBABE

#define ACC_PUBLIC    0x0001 // Declared public; may be accessed from outside its package.
#define ACC_PRIVATE	  0x0002 // Declared private; usable only within the defining class.
#define ACC_PROTECTED 0x0004 // Declared protected; may be accessed within subclasses.
#define ACC_STATIC	  0x0008 // Declared static.
#define ACC_FINAL     0x0010 // Declared final; no subclasses allowed.
#define ACC_SUPER     0x0020 // Treat superclass methods specially when invoked by the invokespecial instruction.
#define ACC_VOLATILE  0x0040 // Declared volatile; cannot be cached.
#define ACC_NATIVE	  0x0100 // Declared native; implemented in a language other than Java.
#define ACC_INTERFACE 0x0200 // Is an interface, not a class.
#define ACC_ABSTRACT  0x0400 // Declared abstract; may not be instantiated.
#define ACC_TRANSIENT 0x0080 // Declared transient; not written or read by a persistent object manager.
