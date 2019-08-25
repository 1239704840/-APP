function getWebservicesData(functionName, paramTag) {
	var data =
		'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	data = '<?xml version="1.0" encoding="utf-8"?>' + data;
	data = data + '<soap:Body>';
	data = data + '<' + functionName + ' xmlns="' + url + '">';
	data = data + paramTag;
	data = data + '</' + functionName + '>';
	data = data + '</soap:Body>';
	data = data + '</soap:Envelope>';
	return (data);
}

