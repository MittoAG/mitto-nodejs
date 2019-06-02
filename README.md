# Mitto REST API Node.js client

This is the official Node.js client for the Mitto REST API (<https://www.mitto.ch>).

NPM-Package: <https://www.npmjs.com/package/mitto-rest-client>

## Install

```Console
npm install mitto-rest-client
```

## Usage

### Simple SMS sending

```javascript
var apiKey = "YOUR-API-KEY";
var testMode = false; // optional; set to true if you want to send a test messages (no delivery, no cost, but visible in your portal)

require("mitto-rest-client")
    .create(apiKey, testMode)
    .sendTextMessage("YourSender", "491771234567", "Hello World!");
```

### Send flash SMS

```javascript
var apiKey = "YOUR-API-KEY";

require("mitto-rest-client")
    .create(apiKey)
    .sendTextMessage("YourSender", "491771234567", "Hello World!", {flash: true});
```

### Set a client reference

```javascript
var apiKey = "YOUR-API-KEY";

require("mitto-rest-client")
    .create(apiKey)
    .sendTextMessage("YourSender", "491771234567", "Hello World!", {reference: "My internal reference number #1"});

// in the Mitto customer portal you can configure a DeliveryReport Callback URL; this will receive the "reference" parameter from above...
// alternatively you can support your Account Manager to set the URL for you.
```

### Unicode SMS sending

```javascript
var apiKey = "YOUR-API-KEY";

require("mitto-rest-client")
    .create(apiKey)
    .sendUnicodeTextMessage("YourSender", "491771234567", "привет");
```

### Inspect response

```javascript
var apiKey = "YOUR-API-KEY";

require("mitto-rest-client")
    .create(apiKey)
    .sendTextMessage(
        "YourSender",
        "491771234567",
        "Hello World!",
        function(error, apiResponse) {
            if(error) {
                console.error(error);
            }
            if(apiResponse) {
                console.log(
                    "ResponseCode: " + apiResponse.responseCode + "\n" +
                    "ResponseText: " + apiResponse.responseText + "\n" +
                    "MessageId: " + apiResponse.id + "\n" +
                    "Timestamp: " + apiResponse.timestamp + "\n" +
                    "TextLength: " + apiResponse.textLength + "\n\n"
                );
            }
        }
    );
```
