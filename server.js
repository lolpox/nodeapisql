const express = require("express");
const bodyParser = require('body-parser');
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.listen(port, () => {
	console.log(`Server listening on port ${port}/`);
});

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "crud_api",
});

connection.connect((error) => {
	if (error) {
		console.error(error);
	} else {
		console.log("Connected to the database");
	}
});

app.get("/users", (request, response) => {
	connection.query("SELECT name, email FROM users", (error, data) => {
		if (error) {
			console.error(error);
			response.status(500).send("Error retrieving users");
		} else {
			response.send(data);
		}
	});
});

app.post('/users', (request, response) => {
  const { name, email } = request.body;
  connection.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (error) => {
    if (error) {
      console.error(error);
      response.status(500).send('Error creating user');
    } else {
      response.send('User created successfully');
    }
  });
});

app.put("/users/:id", (request, response) => {
	const { id } = request.params;
	const { name, email } = request.body;
	connection.query(
		"UPDATE users SET name = ?, email = ? WHERE id = ?",
		[name, email, id],
		(error) => {
			if (error) {
				console.error(error);
				response.status(500).send("Error updating user");
			} else {
				response.send("User updated successfully");
			}
		}
	);
});

app.delete("/users/:id", (request, response) => {
	const { id } = request.params;
	connection.query("DELETE FROM users WHERE id = ?", [id], (error) => {
		if (error) {
			console.error(error);
			response.status(500).send("Error deleting user");
		} else {
			response.send("User deleted successfully");
		}
	});
});
