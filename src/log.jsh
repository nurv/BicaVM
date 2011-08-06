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


function htmlentities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

#define LOG(msg) write(msg);\
    if (console){\
        console.log(msg);\
    }
#endif
