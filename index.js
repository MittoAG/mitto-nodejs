var https = require("https");

String.prototype.lpad = function(padString, length) {
	var str = this;
	while (str.length < length)
		str = padString + str;
	return str;
};

var MittoClient = function(apiKey, testMode, debugMode){
    var headers = {
		"Content-Type": "application/json",
		"User-Agent": "Mitto/Client/Node.js/2.0",
        "X-Mitto-API-Key": apiKey
    };
	var baseParams = {};
	if(testMode && testMode == true) {
		baseParams.test = true;
	}
	var sendSmsPath = "/sms.json";
	
	function log(logMessage) {
		if (logMessage instanceof Error) console.log(logMessage.stack);
		if (debugMode) {
			if (typeof logMessage === "object") {
				console.dir(logMessage);
			} else {
				console.log(logMessage);
			}
		}
	}
	
	function sendRequest(path, method, postData, callback) {
		var responseCallback = function(response) {
			var responseReturn = "";
			response.setEncoding("utf8"); 
			response.on("data", function(chunk) {
        		responseReturn += chunk;
			});			
			response.on("end", function() { 
				log("response ended");
				if (callback) {
					var jsonResponse = responseReturn;
					var error = null;
					try {
					jsonResponse = JSON.parse(responseReturn);
					} catch (parseException) {
						log(parseException);
						log("Response wasn't proper JSON, returning raw response to client");
						error = parseException;
					}
					callback(error, jsonResponse);
				}
			});
		};
        
        var postDataJSON = JSON.stringify({...postData, ...baseParams});
        var options = {
			host: "rest.mittoapi.com",
    		port: 443,
    		path: path,
    		method: method,
            headers: {...headers, "Content-Length": Buffer.byteLength(postDataJSON)}
        };
        
		log("executing " + options.method + " request to " + options.host + ":" + options.port + options.path + " POST-Data: " + postDataJSON);
        
        var request = https.request(options, responseCallback);
        
        request.write(postDataJSON);
		request.end();
		
		request.on("error", function(e) {
			log("error on API request; detailed stacktrace below ");
			log(e);
			callback(e);
		});
	}
	
	function sendMessage(message, additionalOptions, callback) {
		sendRequest(sendSmsPath, "POST", {...message, ...additionalOptions}, function(error, apiResponse) {
			if (!error && apiResponse && apiResponse.responseCode && apiResponse.responseCode > 0) {
				tryHandleError(callback, new Error("Mitto REST API returned ResponseCode " + apiResponse.responseCode + " (" + apiResponse.responseText + ")"), apiResponse);
			} else if (callback) {
				callback(error, apiResponse);
			}
		});
	}
	
	function tryHandleError(callback, error, returnData) {
		if (callback) {
			callback(error, returnData);
		} else {
			throw error;
		}
	}
	
	function sendTextMessage(from, to, text, additionalOptions, callback) {
		sendMessage({from: from, to: to, text: text}, additionalOptions, callback)
	}
	
	function sendUnicodeTextMessage(from, to, text, additionalOptions, callback) {
		sendMessage({from: from, to: to, text: text, type: "unicode"}, additionalOptions, callback)
	}
	
	return {
		sendTextMessage: sendTextMessage,
		sendUnicodeTextMessage: sendUnicodeTextMessage
	};
};

exports.create = MittoClient;