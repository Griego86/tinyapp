const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id]; // Retrieving the long URL associated with the ID from urlDatabase
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; // Assuming the form field name is "longURL"
  const id = generateRandomString(); // Generate a random ID
  urlDatabase[id] = longURL; // Save the new ID-longURL pair to the urlDatabase
  res.redirect(`/urls/${id}`); // Redirect to the new URL page for the newly generated short URL
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
    delete urlDatabase[id]; // Using the delete operator to remove the URL resource
    res.redirect("/urls"); // Redirect back to the urls_index page
  } else {
    res.status(404).send("URL not found");
  }
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Short URL not found");
  }
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newURL = req.body.newLongURL; // Assuming the form field name is "newLongURL"

  if (urlDatabase[id]) {
    urlDatabase[id] = newURL; // Update the stored long URL with the new value
    res.redirect("/urls"); // Redirect back to the urls_index page
  } else {
    res.status(404).send("URL not found");
  }
});
