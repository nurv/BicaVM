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
    this.verifyAndLoadClass = function(classFile){
        if (!this.method_area[classFile]){
//            log(">>>>>> " + classFile);
            var loaded_class = LoadClassFile(classFile);
            var className = loaded_class.this_class.name_ref.str.replace(/\//g,".");

            this.method_area[className] = loaded_class;
            var superClass;
            if(loaded_class.super_class){
                superClass = canonicalName(loaded_class.super_class.name_ref);
            }else{
                superClass = "java.lang.Object";
            }
            this.verifyAndLoadClass(superClass);
            
            var that = this;
            
            loaded_class.constantPool.each(function(constant){
                if (constant.name_ref.str.charAt(0) == "[") {
                    return;
                }
                that.verifyAndLoadClass(canonicalName(constant.name_ref));    
            }, CONSTANT_Class);
            
            log("[Loaded " + className  + " from runtime/" + classFile + "]");
        }
    };
    
    this.run = function (){
        var mainClass = this.args[0];
        this.verifyAndLoadClass(mainClass);
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