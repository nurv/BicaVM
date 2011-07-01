DataStream = function(data){
    this.i = 0;
    this.getU = function(size){
	switch(size){
	case 1:
	    this.constantPoolCount = new DataView(data,this.i,1).getUint8(0);
	    this.i += 1;
	    break;
	case 2:
	    this.constantPoolCount = new DataView(data,this.i,2).getUint16(0);
	    this.i += 2;
	    break;
	case 4:
	    this.constantPoolCount = new DataView(data,this.i,4).getUint32(0);
	    this.i += 4;
	    break;
	case 8:
	    this.constantPoolCount = new DataView(data,this.i,8).getUint64(0);
	    this.i += 8;
	    break;
	}
    };

    this.get = function(size){
	switch(size){
	case 1:
	    this.constantPoolCount = new DataView(data,this.i,1).getInt8(0);
	    this.i += 1;
	    break;
	case 2:
	    this.constantPoolCount = new DataView(data,this.i,2).getInt16(0);
	    this.i += 2;
	    break;
	case 4:
	    this.constantPoolCount = new DataView(data,this.i,4).getInt32(0);
	    this.i += 4;
	    break;
	case 8:
	    this.constantPoolCount = new DataView(data,this.i,8).getInt64(0);
	    this.i += 8;
	    break;
	}
    }

    this.getUint8 = function () { return this.getU(1) }
    this.getU1 = this.getUint8;
    this.getUint16 = function () { return this.getU(2) }
    this.getU2 = this.getUint16;
    this.getUint32 = function () { return this.getU(4) }
    this.getU4 = this.getUint32;
    this.getUint64 = function () { return this.getU(8) }
    this.getU8 = this.getUint64;

    this.getInt8  = function () { return this.get(1) }
    this.getInt16 = function () { return this.get(2) }
    this.getInt32 = function () { return this.get(4) }
    this.getInt64 = function () { return this.get(8) }
}