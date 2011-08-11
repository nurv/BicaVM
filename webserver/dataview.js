function DataView(buffer, start, size){
    this.getFloat64 = function (offset) {
		var b0 = buffer.charCodeAt(start + offset) & 0xFF,
			b1 = buffer.charCodeAt(start + offset + 1) & 0xFF,
			b2 = buffer.charCodeAt(start + offset + 2) & 0xFF,
			b3 = buffer.charCodeAt(start + offset + 3) & 0xFF,
			b4 = buffer.charCodeAt(start + offset + 4) & 0xFF,
			b5 = buffer.charCodeAt(start + offset + 5) & 0xFF,
			b6 = buffer.charCodeAt(start + offset + 6) & 0xFF,
			b7 = buffer.charCodeAt(start + offset + 7) & 0xFF,

			sign = 1 - (2 * (b0 >> 7)),
			exponent = ((((b0 << 1) & 0xff) << 3) | (b1 >> 4)) - (Math.pow(2, 10) - 1),

		// Binary operators such as | and << operate on 32 bit values, using + and Math.pow(2) instead
			mantissa = ((b1 & 0x0f) * Math.pow(2, 48)) + (b2 * Math.pow(2, 40)) + (b3 * Math.pow(2, 32))
					+ (b4 * Math.pow(2, 24)) + (b5 * Math.pow(2, 16)) + (b6 * Math.pow(2, 8)) + b7;

		if (mantissa == 0 && exponent == -(Math.pow(2, 10) - 1)) {
			return 0.0;
		}

		if (exponent == -1023) { // Denormalized
			return sign * mantissa * Math.pow(2, -1022 - 52);
		}

		return sign * (1 + mantissa * Math.pow(2, -52)) * Math.pow(2, exponent);
	},

	this.getFloat32 =  function (offset) {
		var b0 = buffer.charCodeAt(start + offset ) & 0xFF,
			b1 = buffer.charCodeAt(start + offset +1) & 0xFF,
			b2 = buffer.charCodeAt(start + offset +2) & 0xFF,
			b3 = buffer.charCodeAt(start + offset +3) & 0xFF,

			sign = 1 - (2 * (b0 >> 7)),
			exponent = (((b0 << 1) & 0xff) | (b1 >> 7)) - 127,
			mantissa = ((b1 & 0x7f) << 16) | (b2 << 8) | b3;

		if (mantissa == 0 && exponent == -127) {
			return 0.0;
		}

		if (exponent == -127) { // Denormalized
			return sign * mantissa * Math.pow(2, -126 - 23);
		}

		return sign * (1 + mantissa * Math.pow(2, -23)) * Math.pow(2, exponent);
	},

	this.getInt32 = function (offset) {
		var b = this.getUint32(offset);
		return b > Math.pow(2, 31) - 1 ? b - Math.pow(2, 32) : b;
	},

	this.getUint32 =  function (offset) {
		var b0 = buffer.charCodeAt(start + offset + 3) & 0xFF,
			b1 = buffer.charCodeAt(start + offset + 2) & 0xFF,
			b2 = buffer.charCodeAt(start + offset + 1) & 0xFF,
			b3 = buffer.charCodeAt(start + offset ) & 0xFF;

		return (b3 * Math.pow(2, 24)) + (b2 << 16) + (b1 << 8) + b0;
	},

	this.getInt16 = function (offset) {
		var b = this.getUint16(offset);
		return b > Math.pow(2, 15) - 1 ? b - Math.pow(2, 16) : b;
	},

	this.getUint16 = function (offset) {
		var b0 = buffer.charCodeAt(start + offset + 1)     & 0xFF,
			b1 = buffer.charCodeAt(start + offset) & 0xFF;
		return (b1 << 8) + b0;
	},

	this.getInt8 = function (offset) {
		var b = this.getUint8(offset);
		return b > Math.pow(2, 7) - 1 ? b - Math.pow(2, 8) : b;
	},

	this.getUint8 = function (offset) {
		return buffer.charCodeAt(start + offset) & 0xff;
	}
}