const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  const alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * alphanumeric.length);
    randomString += alphanumeric[randomIndex];
  }
  return randomString;
}

// Routes
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username // Pass the username to the template
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies.username // Pass the username to the template
  };
  res.render("urls_new", templateVars);
});

// Other routes...

app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie('username', username); // Set the cookie with the username
  res.redirect('/urls'); // Redirect the browser back to the /urls page
});

app.post("/logout", (req, res) => {
  res.clearCookie('username'); // Clear the username cookie
  res.redirect('/urls'); // Redirect the browser back to the /urls page
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});