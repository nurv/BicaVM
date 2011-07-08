function canonicalName(ref){
    return ref.str.replace(/\//g,".")
}

var JVM = function(params,args){
    this.heap = {};
    this.params = params;
    this.args = args; 
    this.method_area = {};
    this.level = 0;
    this.classpath = params.classes_to_load;

    this.classForName = function (name){
        var superClass, loaded_class = this.method_area[name];
        
        if (!loaded_class){
            loaded_class = LoadClassFile(name, this);
            this.method_area[name] = loaded_class;
            this.verifyAndLoadClass(loaded_class);
            
            log("[Loaded " + name  + "]");
        }
        
        return loaded_class;
        
    }
    
    this.verifyAndLoadClass = function(loaded_class){
        var superClass;
        if(loaded_class.super_class){
            // if super_class not java.lang.Object
            superClass = canonicalName(loaded_class.super_class.name_ref);
            this.classForName(superClass);
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
        var mainClass = this.args[0];
        this.classForName(mainClass);
    };
};

var JVMThread = function(){
    this.pc = null;
    this.stack = [];
}

var JVMFrame = function(){
    this.local_variables = [];
    this.operand_stack = [];
    
}

function JVM_THROWS_NEW(exception){
    throw "VER: throws new " + exception;
}

function interpret(frame){
    var operand_stack = frame.operand_stack;
    var local_variables = frame.local_variables;
    var code = 0; //resolve code from method;
    
    switch(opcode){
    case 0x32: // aaload
        var index = operand_stack.pop();
        var arrayref = operand_stack.pop();

        if (arrayref == NULL){
            JVM_THROWS_NEW("java.lang.NullPointerException");
        }
        if (index >= arrayref.length){
            JVM_THROWS_NEW("java.lang.ArrayIndexOutOfBoundsException");
        }
        operand_stack.push(arrayref.value[index.value]);
        break;

    case 0x53: // aastore
        var value = operand_stack.pop();
        var index = operand_stack.pop();
        var arrayref = operand_stack.pop();
        
        if (arrayref == NULL){
            JVM_THROWS_NEW("java.lang.NullPointerException");
        }
        if (index >= arrayref.length){
            JVM_THROWS_NEW("java.lang.ArrayIndexOutOfBoundsException");
        }
        if (!arrayref.classRef.isAssignable(value.cl)){
            JVM_THROWS_NEW("java.lang.ArrayStoreException");
        }
        break;
        
    case 0x1: //aconst_null
        operand_stack.push(null);
        break;
    case 0x19: //aload
        var i = operand_stack.pop();
        operand_stack.push(local_variables[i])
        break;
    case 0x2a:
    case 0x2b:
    case 0x2c:
    case 0x2d: // aload_<n>
        operand_stack.push(local_variables[opcode - 0x2a]);
        break;
    case 0xbd: // anewarray
        var indexbyte1 = code.pop();
        var indexbyte2 = code.pop();
        var count = operand_stack.pop();
        if (count < 0){
            JVM_THROWS_NEW("java.lang.NegativeArraySizeException");
        }
        var clRef = frame.classRef.constantPool.get((indexbyte1 << 8) | indexbyte2);
        var instance = {length:count, value:[], classRef:this.jvm.classForName(clRef)};
        operand_stack.push(instance);
        break;
    case 0xb0: // areturn
        var objectref = operand_stack.pop();
        return {return_object: objectref}
    case 0xbe: // arraylength
        var arrayref = operand_stack.pop();
        operand_stack.push(arrayref.length);
        break;
    case 0x3a: // astore
        var objectref = operand_stack.pop();
        local_variables[code.pop()] = objectref;
        break;
    case 0x4b:
    case 0x4c:
    case 0x4d:
    case 0x4e: // astore_<n>
        var objectref = operand_stack.pop();
        local_variables[opcode-0x4b] = objectref;
        break;
    case 0xbf: // athrow
        var objectref = operand_stack.pop();
        if (objectref == null){
            JVM_THROWS_NEW("java.lang.NullPointerException");
        }
        throw [objectref.classRef.name_ref.str,objectref];
    case 0x33: // baload
        var value = operand_stack.pop();
        var index = operand_stack.pop();
        var arrayref = operand_stack.pop();

        
        if (arrayref == NULL){
            JVM_THROWS_NEW("java.lang.NullPointerException");
        }
        if (index >= arrayref.length){
            JVM_THROWS_NEW("java.lang.ArrayIndexOutOfBoundsException");
        }
        arrayref.value[index] = value;
        break;
    case 0x10: // bipush
        operand_stack.push(code.pop());
        break;
    case 0x34: // caload
        var index = operand_stack.pop();
        var arrayref = operand_stack.pop();

        operand_stack.push(arrayref.value[index]);
        break;
    case 0x55: // castore
        var value = operand_stack.pop();
        var index = operand_stack.pop();
        var arrayref = operand_stack.pop();

        
        if (arrayref == NULL){
            JVM_THROWS_NEW("java.lang.NullPointerException");
        }
        if (index >= arrayref.length){
            JVM_THROWS_NEW("java.lang.ArrayIndexOutOfBoundsException");
        }
        arrayref.value[index] = value;
        break;
    case 0xc0: // checkcast
        var objectref = operand_stack.pop();
        var indexbyte1 = code.pop();
        var indexbyte2 = code.pop();
        var clRef = frame.classRef.constantPool.get((indexbyte1 << 8) | indexbyte2);
        if (objectref.classRef.isAssignable(clRef)){
            operand_stack.push(objectref);
        }else{
            JVM_THROWS_NEW("java.lang.ClassCastException");            
        }
    }
}