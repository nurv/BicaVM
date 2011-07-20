/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2011 by Artur Ventura
 *
 * File: log.jsh
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
