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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// Functions to interact with the 'users' object
function addUser(email, password) {
  const id = generateRandomString();
  const newUser = {
    id,
    email,
    password
  };
  users[id] = newUser;
  return id;
}

function findUserByEmail(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}

function generateRandomString() {
  const alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * alphanumeric.length);
    randomString += alphanumeric[randomIndex];
  }
  return randomString;
}

// Function to find a user by ID
function findUserById(userId) {
  return users[userId];
}

// Routes
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/urls", (req, res) => {
  const user = findUserById(req.cookies.user_id);
  const templateVars = {
    urls: urlDatabase,
    user: user // Pass the entire user object to the template
  };
  res.render("urls_index", templateVars);
});

// Modify the /urls/new endpoint to pass the user object
app.get("/urls/new", (req, res) => {
  const user = findUserById(req.cookies.user_id);
  const templateVars = {
    user: user // Pass the entire user object to the template
  };
  res.render("urls_new", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (user && user.password === password) {
    res.cookie('user_id', user.id);
    res.redirect('/urls');
  } else {
    res.status(403).send("Invalid email or password");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (user) {
    res.status(400).send("Email already exists");
  } else {
    const userId = addUser(email, password);
    res.cookie('user_id', userId);
    res.redirect('/urls');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});