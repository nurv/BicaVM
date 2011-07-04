
include("linearDataStream.js");
include("constantPool.js");
include("attributes.js");
include("infos.js");
include("class.js");
include("cpu.js");

function main (args){
    new JVM({},["java.text.DecimalFormat"]).run();
}