function javaString2JS (string) {
	var arr = string['java/lang/String value']['value'];
	var result = "";
	for (var i=0; i < arr.length; i++) {
		result += String.fromCharCode(arr[i]);
	};
	return result
}