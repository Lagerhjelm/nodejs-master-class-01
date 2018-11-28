const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

var handlers = {}

handlers.notFound = function(data, callback) {
	callback(404);
}

handlers.hello = function(data, callback) {
	callback(200, { "message" : "Welcome to the first assignment!" } );
}

var paths = {
    'hello' : handlers.hello,
    'notFound' : handlers.notFound
}

var router = function(req, res) {

    var parsedURL = url.parse(req.url, true);
    
    var path = parsedURL.pathname;
    
    var trimmedPath = path.replace(/^\/+|\/$/g,'');
    
    var queryStringObject = parsedURL.query;
    
    var method = req.method.toLowerCase();
    
    var headers = req.headers;
    
    var decoder = new StringDecoder('utf-8');
    
	var buffer = '';

	req.on('data', function(data){
		buffer += decoder.write(data);
	});

	req.on('end', function(){
		buffer += decoder.end();

		// Construct dataobject to send to the handler.
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		};

		// Choose handler request should go to, if not found select 404
		var chosenHandler = typeof(paths[trimmedPath]) !== 'undefined' ? paths[trimmedPath] : paths.notFound;

		chosenHandler(data, function(statusCode, payload){
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};

			var payloadString = JSON.stringify(payload)

			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			console.log('We are returning this response: ', statusCode, payloadString);
		});
	});
}

module.exports = router;
