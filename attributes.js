
var Attributes_table = {
    ConstantValue: function(){
        this.read = function(dStream, constantPool){
            this.constantvalue = ConstantPoolRef(dStream.getU2(), constantPool);
            switch(this.constantvalue.id){
            case CONSTANT_Long:
            case CONSTANT_Float:
            case CONSTANT_Double:
            case CONSTANT_Integer:
            case CONSTANT_String:
                return;
            default:
                throw "ConstantValue Attr points to wrong constant value, got " + constTagName(this.constantvalue.id);
                
            }
        }
    },

    Code: function(){
        this.read = function(dStream, constantPool){
            
        }
    }
};

function UnkownAttr(){
    this.read = function(dStream){
        this.info = [];
        for(var i=0; i<attribute_length; i++){
            this.info[i] = dStream.getU1();
        }
    }
}

var Attribute = function(dStream, constantPool){
    var attribute_name = ConstantPoolRef(dStream.getU2(), constantPool, CONSTANT_Utf8);
    var action = Attributes_table[attribute_name.str];
    var result;
    if (action){
        result = new action();
    }else{
        result = new UnkownAttr();
    }
    result.attribute_name = attribute_name;
    result.attribute_length = dStream.getU4();
    result.read(dStream, constantPool);
}