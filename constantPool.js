var CONSTANT_Class = 7;
var CONSTANT_Fieldref = 9;
var CONSTANT_Methodref = 10;
var CONSTANT_InterfaceMethodref = 11;
var CONSTANT_String = 8;
var CONSTANT_Integer = 3;
var CONSTANT_Float = 4;
var CONSTANT_Long = 5;
var CONSTANT_Double = 6;
var CONSTANT_NameAndType = 12;
var CONSTANT_Utf8 = 1;

constUtf8 = function(){
    this.str = null;
    this.read = ( dStream ) {
    StringBuffer strBuf;
    int len, charCnt;
    byte one_byte;
    char one_char;

    one_char = '\u0000';
    len = readU2( dStream );
    strBuf = new StringBuffer();
    charCnt = 0;
    while (charCnt < len) {
      one_byte = (byte)readU1( dStream );
      charCnt++;
      if ((one_byte >> 7) == 1) {
	short tmp;

	// its a multi-byte character
	tmp = (short)(one_byte & 0x3f);  // Bits 5..0 (six bits)
	// read the next byte
	one_byte = (byte)readU1( dStream );
	charCnt++;
	tmp = (short)(tmp | ((one_byte & 0x3f) << 6));
	if ((one_byte >> 6) == 0x2) {
	  // We have 12 bits so far, get bits 15..12
	  one_byte = (byte)readU1( dStream );
	  charCnt++;
	  one_byte = (byte)(one_byte & 0xf);
	  tmp = (short)(tmp | (one_byte << 12));
	}
	one_char = (char)tmp;
      }
      else {
	one_char = (char)one_byte;
      }
      strBuf.append(one_char);
    } // while
    this.str = strBuf.toString();
  } // read
};

allocConstEntry = function(tag){
    var obj = null;

    switch ( tag ) {
    case CONSTANT_Utf8:
      obj = new constUtf8();
      break;
    case CONSTANT_Integer:
      obj = new constInt();
      break;
    case CONSTANT_Float:
      obj = new constFloat();
      break;
    case CONSTANT_Long:
      obj = new constLong();
      break;
    case CONSTANT_Double:
      obj = new constDouble();
      break;
    case CONSTANT_Class:
    case CONSTANT_String:
      obj = new constClass_or_String();
      break;
    case CONSTANT_Fieldref:
    case CONSTANT_Methodref:
    case CONSTANT_InterfaceMethodref:
      obj = new constRef();
      break; 
    case CONSTANT_NameAndType:
      obj = new constName_and_Type_info();
      break;
    default:
      System.out.println("allocConstEntry: bad tag value = " + tag);
      break;
    } // switch
}