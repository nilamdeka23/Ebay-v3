
var crypto = require('crypto');
var logger = require('./logger');
var soap = require('soap');
var baseURL = "http://localhost:8080/EbayWebServer/services/";

exports.getProfile = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " VIEWED PROFILE PAGE");

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Profile?wsdl";

	var args = {
		userId : req.session.userId
	};

	soap.createClient(url, option, function(err, client) {
		client.get(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var getReturn = JSON.parse(result.getReturn);

				console.log("getProfile", getReturn);

				res.send(getReturn);
			}

		});
	});
};

exports.updateProfile = function(req, res) {

	logger.info("USER ID: " + req.session.userId
			+ " tried UPDATING PRFOILE PAGE");

	// encrypt password
	var cryptoCipher = crypto.createCipher('aes-256-ctr', '14Lab3');
	var encryptedPwd = cryptoCipher
			.update(req.param("password"), 'utf8', 'hex');
	encryptedPwd += cryptoCipher.final('hex');

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Profile?wsdl";

	var args = {
		email : req.param("email"),
		password : encryptedPwd,
		firstName : req.param("firstName"),
		lastName : req.param("lastName"),
		dob : req.param("dob"),
		about : req.param("about"),
		contact : req.param("contact"),
		address : req.param("address"),
		userId : req.session.userId
	};

	soap.createClient(url, option, function(err, client) {
		client.update(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var updateReturn = JSON.parse(result.updateReturn);

				console.log("updateProfile", updateReturn);

				if (updateReturn.statusCode == 200) {

					logger.info("USER with EMAIL: " + req.param("email")
							+ " and USER ID: " + req.session.userId
							+ " UPDATED PROFILE SUCCESSFULLY");

				}
				res.send(updateReturn);
			}

		});
	});
};
