const http = require('http');
const router = require('./router');

// Instantiate HTTP server.
var httpServer = http.createServer(function(req, res){
// Pass request to router
    router(req, res)
});

// Start HTTP server.
httpServer.listen(3000, function(){
	console.log("The http server is listening on " + 3000 );
});
