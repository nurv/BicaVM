
// Local Variables Types
var LOC_VAR_boolean       = 0x001;
var LOC_VAR_byte          = 0x002;
var LOC_VAR_char          = 0x004;
var LOC_VAR_short         = 0x008;
var LOC_VAR_int           = 0x010;
var LOC_VAR_float         = 0x020;
var LOC_VAR_reference     = 0x040;
var LOC_VAR_returnAddress = 0x080;
var LOC_VAR_long          = 0x100;
var LOC_VAR_double        = 0x200;

// Reference Types
var REF_TYPE_class        = 0x1;
var REF_TYPE_interface    = 0x2;
var REF_TYPE_array        = 0x4

function makeLocalVar(kind){
    return {id:kind};
}

function getRefClass(ref){
    if (ref.type == REF_TYPE_array){
        return getArrayClass();
    }else{
        return ref.classRef;
    }
}

var NULL = makeLocalVar(LOC_VAR_reference);

function isSubClass(refS,refT){

}

function implements(refS,refT){

}