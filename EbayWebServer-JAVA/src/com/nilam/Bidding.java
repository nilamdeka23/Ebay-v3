package com.nilam;

import org.json.simple.JSONObject;

import dbconfig.DBConnection;

import javax.jws.WebService;

@WebService
public class Bidding {

	private DBConnection dbConnection = new DBConnection();

	public String place(String userId, String productId, String bidAmount) {
		JSONObject result = new JSONObject();
		try {

			String query = "insert into bids (bidderId, bidProductId, bidAmount) values (" + userId + ", " + productId
					+ ", " + bidAmount + ")";
			int insert = dbConnection.updateResultSet(query);

			if (insert == 1) {
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
