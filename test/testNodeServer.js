var expect = require('chai').expect;
var http = require('http');

// Below code demonstrates using various methods of testing
describe('Testing Server', function() {

  before(function(done){
    require(process.cwd() + '/server/server');
    setTimeout(done, 5000); // Waiting 5 seconds for server to start
    this.timeout(10000);
  });
/*
  it('Public endpoint returns "healthz"', function(done){
    var responseString = '';

    var options = {
      host: 'localhost',
      port: process.env.PORT || 3001,
      path: '/healthz'
    };

    var callback = function(response){
      response.on('data', function (chunk) {
        responseString += chunk;
      });

      response.on('end', function () {
        expect(responseString).to.include('UP');
        done();
      });
    };

    http.request(options, callback).end();
  });
*/
  it('Test advisor migration flow',function(done){
    var responseString = '';
    var options = {
      host: 'localhost',
      headers: {
         "accept": "application/json",
         "content-type": "application/json"
      },
      method: 'POST',
      port: process.env.PORT || 3001,
      path: '/api/advisor'
    };
    var callback = function(response){
      response.on('data', function (chunk) {
        responseString += chunk;
      });

      response.on('end', function () {
        console.log(JSONstringify(responseString,null,2));
        done();
      });
    };

    var req=http.request(options, callback);
    req.write("{\"text\": \"migrate to the cloud\",\"conversationId\":\" \"}");
    req.end();
  });

});
