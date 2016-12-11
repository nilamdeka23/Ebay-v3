package com.nilam;

import org.json.simple.JSONObject;

import dbconfig.DBConnection;

import java.sql.ResultSet;

import javax.jws.WebService;

@WebService
public class Profile {

	private DBConnection dbConnection = new DBConnection();

	public String get(String userId) {
		JSONObject result = new JSONObject();
		try {
			String query = "select * from users where userId=" + userId;
			ResultSet user = dbConnection.getResultSet(query);

			if (user.next()) {
				JSONObject data = new JSONObject();

				data.put("email", user.getString("email"));
				data.put("password", user.getString("password"));
				data.put("firstName", user.getString("firstName"));
				data.put("lastName", user.getString("lastName"));
				data.put("dob", user.getString("dob"));
				data.put("about", user.getString("about"));
				data.put("contact", user.getString("contact"));
				data.put("address", user.getString("address"));

				result.put("statusCode", "200");
				result.put("data", data);

			} else {
				result.put("statusCode", "401");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

	public String update(String email, String password, String firstName, String lastName, String dob, String about,
			String contact, String address, String userId) {
		JSONObject result = new JSONObject();
		try {
			String query = "update users set email = '" + email + "', password = '" + password + "',firstName = '"
					+ firstName + "', lastName = '" + lastName + "', dob = '" + dob + "', contact = '" + contact
					+ "', about = '" + about + "', address = '" + address + "' where userId = " + userId;
			int update = dbConnection.updateResultSet(query);

			if (update == 1) {
				result.put("statusCode", "200");
			} else {
				result.put("statusCode", "401");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

}
