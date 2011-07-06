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
            this.method_area[className] = loaded_class;
            this.verifyAndLoadClass(loaded_class);
            
            log("[Loaded " + className  + " from runtime/" + classFile + "]");
        }
        
        return loaded_class;
        
    }
    
    this.verifyAndLoadClass = function(classFile){
        var superClass;
        if(loaded_class.super_class){
            superClass = canonicalName(loaded_class.super_class.name_ref);
        }else{
            superClass = "java.lang.Object";
        }
        this.classForName(superClass);

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

function (frame){
    var operand_stack = frame.operand_stack;
    
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
        
        if (value.ref_of == REF_TYPE_class){
            if (isSubClass(value.ref_of,arrayref.of));
        }
        
        
        
    }
}