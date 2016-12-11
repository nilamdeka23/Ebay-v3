var soap = require('soap');
var baseURL = "http://localhost:8080/CalServer/services";

exports.add = function(req, res) {
	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL + "/Calculation?wsdl";
	var args = {
		paramOne : req.param('paramOne'),
		paramTwo : req.param('paramTwo')
	};
	soap.createClient(url, option, function(err, client) {
		client.add(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {
				res.send({
					statusCode : 200,
					result : result.addReturn
				});
			}

		});
	});
};

exports.sub = function(req, res) {
	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL + "/Calculation?wsdl";
	var args = {
		paramOne : req.param('paramOne'),
		paramTwo : req.param('paramTwo')
	};
	soap.createClient(url, option, function(err, client) {
		client.sub(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {
				res.send({
					statusCode : 200,
					result : result.subReturn
				});
			}

		});
	});
};

exports.mul = function(req, res) {
	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL + "/Calculation?wsdl";
	var args = {
		paramOne : req.param('paramOne'),
		paramTwo : req.param('paramTwo')
	};
	soap.createClient(url, option, function(err, client) {
		client.mul(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 400
				});
			}
			if (result) {
				res.send({
					statusCode : 200,
					result : result.mulReturn
				});
			}

		});
	});
};

exports.div = function(req, res) {

	if (req.param('paramTwo') == 0) {

		res.send({
			statusCode : 401
		});

	} else {

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL + "/Calculation?wsdl";
		var args = {
			paramOne : req.param('paramOne'),
			paramTwo : req.param('paramTwo')
		};
		soap.createClient(url, option, function(err, client) {
			client.div(args, function(err, result) {
				if (err) {
					res.send({
						statusCode : 401
					});
				}
				if (result) {
					res.send({
						statusCode : 200,
						result : result.divReturn
					});
				}

			});
		});

	}
};

exports.cal = function(req, res) {
	res.render('cal', {
		title : 'Simple Calculator'
	});
};

/*
 * exports.add = function(req, res) {
 * 
 * var paramOne = req.param("paramOne"); var paramTwo = req.param("paramTwo");
 * var result = Number(paramOne) + Number(paramTwo); var json_response = {
 * "statusCode" : 200, "result" : result }; res.send(json_response); };
 * 
 * exports.sub = function(req, res) {
 * 
 * var paramOne = req.param("paramOne"); var paramTwo = req.param("paramTwo");
 * var result = Number(paramOne) - Number(paramTwo); var json_response = {
 * "statusCode" : 200, "result" : result }; res.send(json_response); };
 * 
 * exports.mul = function(req, res) {
 * 
 * var paramOne = req.param("paramOne"); var paramTwo = req.param("paramTwo");
 * var result = Number(paramOne) * Number(paramTwo); var json_response = {
 * "statusCode" : 200, "result" : result }; res.send(json_response); };
 * 
 * exports.div = function(req, res) {
 * 
 * var paramOne = req.param("paramOne"); var paramTwo = req.param("paramTwo");
 * var json_response; if (paramTwo !== 0) { var result = Number(paramOne) /
 * Number(paramTwo); json_response = { "statusCode" : 200, "result" : result };
 * res.send(json_response); } else { json_response = { "statusCode" : 401 };
 * res.send(json_response); } };
 */