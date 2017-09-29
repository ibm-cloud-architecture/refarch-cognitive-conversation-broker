var expect = require('chai').expect;
var http = require('http');

// Below code demonstrates using various methods of testing
describe('Testing Server', function() {

  before(function(done){
    require(process.cwd() + '/server/server');
    setTimeout(done, 5000); // Waiting 5 seconds for server to start
    this.timeout(10000);
  });

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

});
