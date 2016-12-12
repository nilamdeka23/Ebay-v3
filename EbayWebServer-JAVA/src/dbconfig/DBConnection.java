package dbconfig;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.Queue;

public class DBConnection {

	private Queue<Connection> connectionPool = new LinkedList<Connection>();

	private static DBConnection dbConnection = null;

	public static DBConnection getInstance() {

		if (dbConnection == null) {
			dbConnection = new DBConnection();
		}
		return dbConnection;
	}

	private DBConnection() {

		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}

		for (int i = 0; i < 10; i++) {

			Connection connection = null;

			try {
				connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/lab1", "root", "14millerMS");
				connectionPool.add(connection);

			} catch (SQLException e) {
				e.printStackTrace();
			}

		}

	}

	private Connection getConnection() throws SQLException {
		if (connectionPool.size() == 0) {
			System.out.println("Connection Pool is empty");
			while (connectionPool.size() < 1) {
				;// do nothing ...keep waiting
				System.out.println("Waiting..");
			}
			System.out.println("Connection Pool is refilled");
		}

		return connectionPool.poll();
	}

	private void returnConnectionToThePool(Connection usedConnection) {
		connectionPool.add(usedConnection);
	}

	// Without Connection Pooling
	/*
	 * private Connection getConnection() throws SQLException { try {
	 * Class.forName("com.mysql.jdbc.Driver"); } catch (ClassNotFoundException
	 * e) { e.printStackTrace(); }
	 * 
	 * Connection connection = null;
	 * 
	 * try { connection =
	 * DriverManager.getConnection("jdbc:mysql://localhost:3306/lab1", "root",
	 * "14millerMS");
	 * 
	 * } catch (SQLException e) { e.printStackTrace(); }
	 * 
	 * return connection; }
	 */

	public ResultSet getResultSet(String query) throws SQLException {
		Connection connection = getConnection();
		Statement statement = (Statement) connection.createStatement();
		ResultSet resultSet = statement.executeQuery(query);
		returnConnectionToThePool(connection);

		return resultSet;
	}

	public int updateResultSet(String query) throws SQLException {
		Connection connection = getConnection();
		Statement statement = (Statement) connection.createStatement();
		int updateResultSet = statement.executeUpdate(query);
		returnConnectionToThePool(connection);

		return updateResultSet;
	}

}
