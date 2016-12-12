
var request = require('request'), express = require('express'), assert = require("assert"), http = require("http");

describe('mocha-http tests', function() {

	it('GET Signin Page for base url', function(done) {
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('Shouldnt GET Home Page as requires authentication', function(done) {
		http.get('http://localhost:3000/home', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});

	
	it('GET 404 for wrong or random URL', function(done) {
		http.get('http://localhost:3000/getSomething', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});

	it('ALLOW signin for right credentials', function(done) {
		request.post('http://localhost:3000/signin', {
			form : {
				"email" : 'jerry@in.com',
				"password" : 'jerry'
			}
		}, function(error, response, body) {
			assert.equal(200, response.statusCode);
			done();
		});
	});
	
	it('DISALLOW signin for wrong credentials', function(done) {
		request.post('http://localhost:3000/signin', {
			form : {
				"email" : 'jj@gmail.com',
				"password" : '1234'
			}
		}, function(error, response, body) {
			assert.equal(200, response.statusCode);
			done();
		});
	});

});