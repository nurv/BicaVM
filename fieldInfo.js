var FieldInfo = function(dStream){
    this.access_flags = dStream.getU2();
    this.name_index = dStream.getU2();
    this.descriptor_index = dStream.getU2();
    this.attributes_count = dStream.getU2();
    // VER: attributes must be restricted.
    this.attributes = [];   
}