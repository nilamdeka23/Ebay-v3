
var ejs = require("ejs");
var crypto = require('crypto');
var logger = require('./logger');
var soap = require('soap');
var baseURL = "http://localhost:8080/EbayWebServer/services/";

exports.signInPage = function(req, res) {

	logger.info("SIGNIN PAGE is HIT");

	ejs.renderFile('./views/signin.ejs', function(err, result) {
		if (!err) {
			res.end(result);
		} else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};

exports.signIn = function(req, res) {

	logger.info("USER with EMAIL: " + req.param("email") + " tries SIGNING IN");

	// encrypt password to match
	var cryptoCipher = crypto.createCipher('aes-256-ctr', '14Lab3');
	var encryptedPwd = cryptoCipher
			.update(req.param("password"), 'utf8', 'hex');
	encryptedPwd += cryptoCipher.final('hex');

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Auth?wsdl";
	var args = {
		email : req.param('email'),
		password : encryptedPwd
	};

	soap.createClient(url, option, function(err, client) {
		client.signin(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var signinReturn = JSON.parse(result.signinReturn);

				if (signinReturn.statusCode == 200) {

					logger.info("USER with EMAIL: " + req.param("email")
							+ " and USER ID: " + signinReturn.data.userId
							+ " SIGNED IN SUCCESSFULLY");

					console.log("Signin Retun: ", signinReturn);

					// initialize session
					req.session.userId = signinReturn.data.userId;
					req.session.firstname = signinReturn.data.firstName;
					req.session.lastLogin = signinReturn.data.lastLoginTime;

				}

				res.send({
					statusCode : signinReturn.statusCode
				});
			}

		});
	});
};

exports.signUp = function(req, res) {

	logger.info("USER with EMAIL: " + req.param("email") + " tries SIGNING UP");

	// encrypt password
	var cryptoCipher = crypto.createCipher('aes-256-ctr', '14Lab3');
	var encryptedPwd = cryptoCipher
			.update(req.param("password"), 'utf8', 'hex');
	encryptedPwd += cryptoCipher.final('hex');

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Auth?wsdl";
	var args = {
		email : req.param('email'),
		password : encryptedPwd,
		firstName : req.param('firstName'),
		lastName : req.param('lastName')
	};

	soap.createClient(url, option, function(err, client) {
		client.signup(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var signupReturn = JSON.parse(result.signupReturn);

				if (signupReturn.statusCode == 200) {

					logger.info("USER with EMAIL: " + req.param("email")
							+ " and USER ID: " + signupReturn.data.userId
							+ " SIGNED UP SUCCESSFULLY");
					
					console.log("Signup Retun: ", signupReturn);

					// initialize session
					req.session.userId = signupReturn.data.userId;
					req.session.firstname = signupReturn.data.firstName;
					req.session.lastLogin = signupReturn.data.lastLoginTime;

				}

				res.send({
					statusCode : signupReturn.statusCode
				});
			}

		});
	});
};

exports.redirectToHome = function(req, res) {
	// Checks before redirecting whether the session is valid
	if (req.session.userId) {
		// get last login time from session object
		var lastLoginTime = req.session.lastLogin + "";
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("home", {
			firstname : req.session.firstname,
			lastLogin : lastLoginTime
		});

	} else {
		res.redirect('/');
	}
};

exports.signout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};
