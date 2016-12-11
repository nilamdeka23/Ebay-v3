package com.nilam;

import org.json.simple.JSONObject;

import dbconfig.DBConnection;

import java.sql.ResultSet;

import javax.jws.WebService;

@WebService
public class Auth {

	private DBConnection dbConnection = new DBConnection();

	public String signin(String email, String password) {
		JSONObject result = new JSONObject();
		try {

			String query = "select * from users where email='" + email + "' and password='" + password + "'";
			ResultSet user = dbConnection.getResultSet(query);

			if (user.next()) {
				JSONObject data = new JSONObject();

				data.put("userId", user.getInt("userId"));
				data.put("firstName", user.getString("firstName"));
				data.put("lastLoginTime", user.getString("lastLoginTime"));

				// update lastLoginTime
				query = "update users set lastLoginTime = current_timestamp() where userId = " + user.getInt("userId");
				int update = dbConnection.updateResultSet(query);
				if (update == 1) {
					result.put("statusCode", "200");
					result.put("data", data);
				} else {
					result.put("statusCode", "401");
				}

			} else {
				result.put("statusCode", "401");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

	public String signup(String email, String password, String firstName, String lastName) {
		JSONObject result = new JSONObject();
		try {
			String query = "insert into users (email, password, firstname, lastname, lastLoginTime) values ('" + email
					+ "', '" + password + "', '" + firstName + "', '" + lastName + "', current_timestamp())";
			int insert = dbConnection.updateResultSet(query);

			if (insert == 1) {

				query = "select * from users where email='" + email + "' and password='" + password + "'";
				ResultSet user = dbConnection.getResultSet(query);

				if (user.next()) {

					JSONObject data = new JSONObject();

					data.put("userId", user.getInt("userId"));
					data.put("firstName", user.getString("firstName"));
					data.put("lastLoginTime", user.getString("lastLoginTime"));
					result.put("statusCode", "200");
					result.put("data", data);

				} else {
					result.put("statusCode", "401");
				}

			} else {
				result.put("statusCode", "401");
			}
		} catch (Exception e) {
			// Handle errors for Class.forName
			e.printStackTrace();
		}
		return result.toString();
	}

}
