
include("linearDataStream.js");
include("constantPool.js");
include("attributes.js");
include("infos.js");
include("class.js");
include("cpu.js");
var test_jvm;
function main (args){
    test_jvm = new JVM({},["[I"])
    test_jvm.run();
}